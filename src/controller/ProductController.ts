import { createQuery } from "odata-v4-mongodb";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Product } from "../model/Product";
import { Category } from "../model/Category";
import connect from "../connect";

@odata.type(Product)
export class ProductsController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Product[]> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        let result = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : await db.collection("Products")
                .find(mongodbQuery.query)
                .project(mongodbQuery.projection)
                .skip(mongodbQuery.skip || 0)
                .limit(mongodbQuery.limit || 0)
                .sort(mongodbQuery.sort)
                .toArray();
        if (mongodbQuery.inlinecount){
            (<any>result).inlinecount = await db.collection("Products")
                    .find(mongodbQuery.query)
                    .project(mongodbQuery.projection)
                    .count(false);
        }
        return result;
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Product> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        return db.collection("Products").findOne({ _id: key }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Category")
    async getCategory( @odata.result result: Product, @odata.query query: ODataQuery): Promise<Category> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        return db.collection("Categories").findOne({ _id: result.CategoryId }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.POST("Category").$ref
    @odata.PUT("Category").$ref
    @odata.PATCH("Category").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const db = await connect();
        return await db.collection("Products").updateOne({
            _id: key
        }, {
                $set: { CategoryId: link }
            }).then((result) => {
                return result.modifiedCount;
            });
    }

    @odata.DELETE("Category").$ref
    async unsetCategory( @odata.key key: string): Promise<number> {
        const db = await connect();
        return await db.collection("Products").updateOne({
            _id: key
        }, {
                $unset: { CategoryId: 1 }
            }).then((result) => {
                return result.modifiedCount;
            });
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Product> {
        const db = await connect();
        return await db.collection("Products").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<Product> {
        const db = await connect();
        if (data._id) delete data._id;
        return await db.collection("Products").updateOne({ _id: key }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data._id ? data : null;
        });
    }

    @odata.PATCH
    async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
        const db = await connect();
        if (delta._id) delete delta._id;
        return await db.collection("Products").updateOne({ _id: key }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        const db = await connect();
        return await db.collection("Products").deleteOne({ _id: key }).then(result => result.deletedCount);
    }

    @Edm.Function
    @Edm.EntityType(Product)
    async getCheapest(): Promise<Product> {
        const db = await connect();
        return (await db.collection("Products").find().sort({ UnitPrice: 1 }).limit(1).toArray())[0];
    }

    @Edm.Function
    @Edm.Collection(Edm.EntityType(Product))
    async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number): Promise<Product[]> {
        const db = await connect();
        return await db.collection("Products").find({ UnitPrice: { $gte: 5, $lte: 8 } }).toArray();
    }

    @Edm.Action
    async swapPrice( @Edm.String a: string, @Edm.String b: string) {
        const db = await connect();
        const products = await db.collection("Products").find({ _id: { $in: [a, b] } }, { UnitPrice: 1 }).toArray();
        const aProduct = products.find(product => product._id.toHexString() === a);
        const bProduct = products.find(product => product._id.toHexString() === b);
        await db.collection("Products").update({ _id: a }, { $set: { UnitPrice: bProduct.UnitPrice } });
        await db.collection("Products").update({ _id: b }, { $set: { UnitPrice: aProduct.UnitPrice } });
    }

    @Edm.Action
    async discountProduct( @Edm.String productId: string, @Edm.Int32 percent: number): Promise<void> {
        const db = await connect();
        const product = await db.collection("Products").findOne({ _id: productId });
        const discountedPrice = ((100 - percent) / 100) * product.UnitPrice;
        await db.collection("Products").update({ _id: productId }, { $set: { UnitPrice: discountedPrice } });
    }
}
