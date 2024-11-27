import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGOENV as string);
async function start() {
    await client.connect();
    console.log("Connected");
}

export default client.db('Oporooms');

start();