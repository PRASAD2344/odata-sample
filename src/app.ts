import express from "express";
import { NorthwindServer } from "./server";
import basicAuth = require("express-basic-auth");
import morgan = require("morgan");

const app = express();

app.listen(3000);

morgan.token('req-headers', (req,res) => {
  return JSON.stringify(req.headers)
});

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :req-headers'))

app.use((req, res, next) => {
  // tslint:disable-next-line: no-string-literal
  if(req.headers.accept && req.headers.accept.indexOf("charset") < 0){
    //req.headers.accept += ";charset=utf-16";
    req.headers.accept = "application/json;odata.metadata=full;charset=utf-16";
  }
  req.headers["accept-charset"] = undefined;
  next();
})

let keysOrder = [
  "@odata.context",
  "@odata.type",
  "@odata.id",
  "@odata.editLink",
  "_id@odata.type",
  "_id",
  "CategoryId@odata.type",
  "CategoryId",
  "Discontinued",
  "Name",
  "QuantityPerUnit",
  "UnitPrice@odata.type",
  "UnitPrice",
  "Category@odata.associationLink",
  "Category@odata.navigationLink",
  "Category",
  "Description",
  "Products@odata.associationLink",
  "Products@odata.navigationLink",
  "value",
  "Products",
]

app.use(basicAuth({
  users: { [process.env.userName] : process.env.password }
}))


app.set("json replacer", keysOrder);

app.use("/", NorthwindServer.create());
