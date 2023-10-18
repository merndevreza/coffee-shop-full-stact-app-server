//=========================
// required files imported
//=========================
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//==============
//middleware
//==============
app.use(cors());
app.use(express.json());

//=======================
//mongodb config
//=======================
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ojansry.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client
      .db("coffeeDB")
      .collection("coffeeCollection");
    const usersCollection = client.db("coffeeDB").collection("users");

    //================
    //coffee
    //================

    //read-multiple
    app.get("/coffees", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // read- single
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });
    //create-single
    app.post("/coffees", async (req, res) => {
      const coffee = req.body;
      const result = await coffeeCollection.insertOne(coffee);
      res.send(result);
    });
    // delete-single
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    //===============
    //User
    //===============

    // create user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //read user - multiple
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //update user - patch
    app.patch("/users",async(req,res)=>{
      const user = req.body;
      const filter={email:user.email}
      const updateDoc={
        $set:{
          email:user.email,
          lastLoggedIn:user.lastLoggedIn,
        }
      }
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result)
    })

    //delete user - single
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //  await client.close();
  }
}
run().catch(console.dir);
//===================
// Express server setup:
// 1. Define the root endpoint which responds with a confirmation message.
// 2. Start the server on the defined port and log a message to the console.
//===================
app.get("/", (req, res) => {
  res.send("Coffee server is running perfectly.");
});
app.listen(port, () => {
  console.log(`Coffee server is running on port: ${port}`);
});
