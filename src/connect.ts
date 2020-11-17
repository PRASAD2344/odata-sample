import { MongoClient, Db } from "mongodb";

let db:any;

export default async function():Promise<Db>{
    if(db){
      return db;
    }
    const uri = process.env.dbURI;
    const client = await MongoClient.connect(uri);
    db = client.db("northwind");
    return db;
};