const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cw6id.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

  try {
    await client.connect();
    const wareHouseCollection = client.db("test").collection("devices");

    console.log('connected to mongodb')

    //get read all inventory
    //http://localhost:5000/inventory
    app.get('/inventory', async (req, res) => {
      const query = req.query;


      const cursor = wareHouseCollection.find(query)
      const result = await cursor.toArray()


      res.send(result)
    })

    //get on item details
    app.get('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await wareHouseCollection.findOne(query);
      res.send(result)
    })



    //create add item
    //http://localhost:5000/item

    app.post("/item", async (req, res) => {

      const data = req.body;

      const result = await wareHouseCollection.insertOne(data)
      res.send(result)
    })

    //update

    app.put('/inventory/:id', async (req, res) => {
      const id = req.params.id;

      const data = req.body;


      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };


      const updateDoc = {
        $set: {
          quantity: data.quantity
        },
      };

      const result = await wareHouseCollection.updateOne(filter, updateDoc, options);


      res.send(result)
      // console.log('from put method', id)
    })

    // delete

    app.delete('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };

      const result = await wareHouseCollection.deleteOne(filter);

      res.send(result);
    })

  }
  finally {

  }

}
run().catch(console.dir);



// client.connect(err => {
//   const collection = client.db("test").collection("devices");

//   console.log('connected to db')
//   // perform actions on the collection object
//   // client.close();
// });



app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


