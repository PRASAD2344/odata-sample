import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mongodb";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Category } from "../model/Category";
import { Product } from "../model/Product";
import connect from "../connect";


@odata.type(Category)
export class CategoriesController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Category[]> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        let result = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : await db.collection("Categories")
                .find(mongodbQuery.query)
                .project(mongodbQuery.projection)
                .skip(mongodbQuery.skip || 0)
                .limit(mongodbQuery.limit || 0)
                .sort(mongodbQuery.sort)
                .toArray();
        if (mongodbQuery.inlinecount){
            (<any>result).inlinecount = await db.collection("Categories")
                    .find(mongodbQuery.query)
                    .project(mongodbQuery.projection)
                    .count(false);
        }
        return result;
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Category> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return db.collection("Categories").findOne({ _id: keyId }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.GET("Products")
    async getProducts( @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product[]> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        let products = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : await db.collection("Products")
            .find({ $and: [{ CategoryId: result._id }, mongodbQuery.query] })
            .project(mongodbQuery.projection)
            .skip(mongodbQuery.skip || 0)
            .limit(mongodbQuery.limit || 0)
            .sort(mongodbQuery.sort)
            .toArray();
        if (mongodbQuery.inlinecount){
            (<any>products).inlinecount = await db.collection("Products")
                    .find({ $and: [{ CategoryId: result._id }, mongodbQuery.query] })
                    .project(mongodbQuery.projection)
                    .count(false);
        }
        return products;
    }

    @odata.GET("Products")
    async getProduct( @odata.key key: string, @odata.result result: Category, @odata.query query: ODataQuery): Promise<Product> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return db.collection("Products").findOne({
            $and: [{ _id: keyId, CategoryId: result._id }, mongodbQuery.query]
        }, {
                fields: mongodbQuery.projection
            });
    }

    @odata.POST("Products").$ref
    @odata.PUT("Products").$ref
    @odata.PATCH("Products").$ref
    async setCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const db = await connect();
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        let linkId;
        try{ linkId = new ObjectID(link); }catch(err){ linkId = link; }
        return await db.collection("Products").updateOne({
            _id: linkId
        }, {
                $set: { CategoryId: keyId }
            }).then((result) => {
                return result.modifiedCount;
            });
    }

    @odata.DELETE("Products").$ref
    async unsetCategory( @odata.key key: string, @odata.link link: string): Promise<number> {
        const db = await connect();
        let linkId;
        try{ linkId = new ObjectID(link); }catch(err){ linkId = link; }
        return await db.collection("Products").updateOne({
            _id: linkId
        }, {
                $unset: { CategoryId: 1 }
            }).then((result) => {
                return result.modifiedCount;
            });
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Category> {
        const db = await connect();
        return await db.collection("Categories").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any): Promise<Category> {
        const db = await connect();
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection("Categories").updateOne({ _id: keyId }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data._id ? data : null;
        });
    }

    @odata.PATCH
    async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
        const db = await connect();
        try{ if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId); }catch(err){}
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection("Categories").updateOne({ _id: keyId }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        const db = await connect();
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection("Categories").deleteOne({ _id: keyId }).then(result => result.deletedCount);
    }
}