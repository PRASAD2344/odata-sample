import express from "express";
import { NorthwindServer } from "./server";


const app = express();

app.listen(3000);


app.use((req, res, next) => {
  // tslint:disable-next-line: no-string-literal
  if(req.headers.accept && req.headers.accept.indexOf("charset") < 0){
    req.headers.accept += ";charset=utf-16";
  }
  req.headers["accept-charset"] = undefined;
  next();
})

app.set("json replacer", (key, value) => {
  if(this && typeof(key) === "string" && key.indexOf("@odata.type") > -1){
    value = undefined;
  }
  return value;
});

app.use("/", NorthwindServer.create());
