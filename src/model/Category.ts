import { Edm } from "odata-v4-server";
import { Product } from "./Product";
import { ObjectID } from "mongodb";

export class Category{
    @Edm.Key
    @Edm.Computed
    @Edm.String
    _id:ObjectID

    @Edm.String
    Description:string

    @Edm.String
    Name:string

    @Edm.Collection(Edm.EntityType(Product))
    @Edm.Partner("Category")
    Products:Product[]
}