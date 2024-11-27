import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb+srv://d21350180:Deepakd213@cluster0.eqn7ymc.mongodb.net/?retryWrites=true&w=majority');
async function start() {
    await client.connect();
    console.log("Connected");
}

export default client.db('Oporooms');

start();