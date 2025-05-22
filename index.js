const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nutvrzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("gardenHub");
    const gardenersCollection = db.collection("gardeners");

    // get 6 active gardeners
    app.get("/gardeners/active",async(req,res)=>{
        try{
            const result = await gardenersCollection
            .find({status: "active"})
            .limit(6)
            .toArray();
            res.send(result);

        }
        catch(error){
            res.status(500).send({message:"Failed to fetch gardeners"});
        }
    });

    // insert gardeners
    app.post("/gardeners",async(req,res)=>{
        try{
            const data=req.body;
            const result = await gardenersCollection.insertMany(data);
            res.send(result);
        }
        catch(error){
            res.status(500).send({message:"Failed to insert"})
        }
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('GardenSphere looks good')
});

app.listen(port,()=>{
    console.log(`GardenSphere server is running on port ${port}`)

})