import { Edm } from "odata-v4-server";
import { Category } from "./Category";

export class Product{
  @Edm.Key
  @Edm.Computed
  @Edm.Guid
  _id:string

  @Edm.EntityType(Edm.ForwardRef(() => Category))
  @Edm.Partner("Products")
  Category:Category

  @Edm.Guid
  @Edm.Required
  CategoryId:string

  @Edm.Boolean
  Discontinued:boolean

  @Edm.String
  Name:string

  @Edm.String
  QuantityPerUnit:string

  @Edm.Decimal
  UnitPrice:number
}