import { MongoClient, Db } from "mongodb";

let db:any;

export default async function():Promise<Db>{
    if(db){
      return db;
    }
    const uri = "mongodb://3F4YwpzUX6Cn3LE1:3F4YwpzUX6Cn3LE1@cluster0-shard-00-00.wseuz.mongodb.net:27017,cluster0-shard-00-01.wseuz.mongodb.net:27017,cluster0-shard-00-02.wseuz.mongodb.net:27017/northwind?ssl=true&replicaSet=atlas-4xscw8-shard-0&authSource=admin&retryWrites=true&w=majority";
    const client = await MongoClient.connect(uri);
    db = client.db("northwind");
    return db;
};