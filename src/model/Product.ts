import { Edm } from "odata-v4-server";
import { Category } from "./Category";
import { ObjectID } from "mongodb";

export class Product{
  @Edm.Key
  @Edm.Computed
  @Edm.String
  _id:ObjectID

  @Edm.EntityType(Edm.ForwardRef(() => Category))
  @Edm.Partner("Products")
  Category:Category

  @Edm.String
  @Edm.Required
  CategoryId:ObjectID

  @Edm.Boolean
  Discontinued:boolean

  @Edm.String
  Name:string

  @Edm.String
  QuantityPerUnit:string

  @Edm.Decimal
  UnitPrice:number
}