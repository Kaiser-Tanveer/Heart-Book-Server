const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tl2ww1y.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        // Collections 
        const postsCollection = client.db("FBDemo").collection("posts");

        // apis 
        app.post('/posts', async (req, res) => {
            const post = req.body;
            console.log(post);
            const result = await postsCollection.insertOne(post);
            console.log(result);
            res.send(result);
        });

        app.get('/posts', async (req, res) => {
            const posts = await postsCollection.find({}).toArray();
            res.send(posts);
        });
    }
    finally {

    }
}

run().catch(err => console.error(err))


app.get('/', (req, res) => {
    res.send('HB server is running...');
});

app.listen(port, (req, res) => {
    console.log(`server is running on port ${port}`);
});