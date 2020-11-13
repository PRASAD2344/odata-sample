import { Edm } from "odata-v4-server";
import { Product } from "./Product";

export class Category{
    @Edm.Key
    @Edm.Guid
    _id:string

    @Edm.String
    Description:string

    @Edm.String
    Name:string

    @Edm.Collection(Edm.EntityType(Edm.ForwardRef(() => Product)))
    @Edm.Partner("Categories")
    Products:Product[]
}