const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tl2ww1y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        // Collections 
        const postsCollection = client.db("FBDemo").collection("posts");
        const likesCollection = client.db("FBDemo").collection("likes");
        const commentsCollection = client.db("FBDemo").collection("comments");
        const repliesCollection = client.db("FBDemo").collection("replies");
        const testCollection = client.db("FBDemo").collection("test");

        // Post apis 
        app.post('/posts', async (req, res) => {
            const post = req.body;
            const result = await postsCollection.insertOne(post);
            res.send(result);
        });

        app.get('/posts', async (req, res) => {
            const posts = await postsCollection.find({}).sort({ _id: -1 }).toArray();
            res.send(posts);
        });

        app.get('/userPosts', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email };
            const posts = await postsCollection.find(filter).toArray();
            res.send(posts);
        });

        // Like apis
        app.post('/likes', async (req, res) => {
            const like = req.body;
            const result = await likesCollection.insertOne(like);
            res.send(result);
        });

        app.get('/likes', async (req, res) => {
            const id = req.query.id;
            const filter = { postId: id };
            const likes = await likesCollection.find(filter).toArray();
            res.send(likes);
        });

        app.delete('/likes', async (req, res) => {
            const id = req.query.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const result = await likesCollection.deleteOne(filter);
            res.send(result);
        });


        // Comment apis 
        app.post('/comments', async (req, res) => {
            const comment = req.body;
            const result = await commentsCollection.insertOne(comment);
            res.send(result);
        });

        app.get('/comments', async (req, res) => {
            const id = req.query.id;
            const filter = { postId: id };
            const likes = await commentsCollection.find(filter).toArray();
            res.send(likes);
        });

        // Reply apis 
        app.post('/replies', async (req, res) => {
            const reply = req.body;
            const result = await repliesCollection.insertOne(reply);
            res.send(result);
        });

        app.get('/replies', async (req, res) => {
            const id = req.query.id;
            const filter = { commentId: id };
            const replies = await repliesCollection.find(filter).toArray();
            res.send(replies);
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
