import { ODataServer, Edm, odata } from "odata-v4-server";
import { ProductsController } from "./controller/ProductController";
import { CategoriesController } from "./controller/CategoryController";
import connect from "./connect";
import categories from "./mock/categories";
import products from "./mock/products";

@odata.cors
@odata.namespace("Northwind")
@odata.controller(ProductsController, true)
@odata.controller(CategoriesController, true)
export class NorthwindServer extends ODataServer{
    @Edm.ActionImport
    async initDb(){
        const db = await connect();
        await db.dropDatabase();
        await db.collection("Categories").insertMany(categories);
        await db.collection("Products").insertMany(products);
    }
}