import { MongoClient, Db } from "mongodb";

export default async function():Promise<Db>{
    const uri = "mongodb://localhost:27017";
    const client = await MongoClient.connect(uri);
    const db = client.db("northwind");
    return db;
};