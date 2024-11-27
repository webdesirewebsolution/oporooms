import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGOURL as string);
async function start() {
    await client.connect();
    console.log("Connected");
}

export default client.db('Oporooms');

start();