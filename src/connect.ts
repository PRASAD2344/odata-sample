import { MongoClient, Db } from "mongodb";

export default async function():Promise<Db>{
    const uri = "mongodb://3F4YwpzUX6Cn3LE1:3F4YwpzUX6Cn3LE1@cluster0-shard-00-00.wseuz.mongodb.net:27017,cluster0-shard-00-01.wseuz.mongodb.net:27017,cluster0-shard-00-02.wseuz.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-4xscw8-shard-0&authSource=admin&retryWrites=true&w=majority";
    const client = await MongoClient.connect(uri);
    const db = client.db("northwind");
    return db;
};