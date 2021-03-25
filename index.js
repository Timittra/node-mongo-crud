const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
// const bodyParser = require('body-parser')
const password = 'timittra123456';

const uri = "mongodb+srv://organicUser:timittra123456@cluster0.nrs6y.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false }));


app.get('/', (req, res) => {
    // res.send('Hello I am working');
    res.sendFile(__dirname + '/index.html');
});



client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    //find({}).limit(4)
    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:id', (req, res) => {
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
        .then(result => {
            console.log('data added successfully');
            // res.send('success');
            res.redirect('/');
        })

    });

    //update method
    app.patch('/update/:id', (req, res) => {
        productCollection.updateOne({ _id: ObjectId(req.params.id)}, 
        {
            $set: {price: req.body.price, quantity: req.body.quantity}
        })
        .then(result =>{
            // console.log(result);
            res.send(result.modifiedCount > 0);
        })
    })

    //Delete method
    app.delete('/delete/:id', (req,res) => {
        // console.log(req.params.id);
        productCollection.deleteOne({ _id: ObjectId(req.params.id)})
        .then(result => {
            // console.log(result);
            res.send(result.deletedCount > 0);
        })
    });

    //   const product = {name: 'Modhu', price: 25, quantity: 20};
    // productCollection.insertOne(product)
    // .then(result => {
    //     console.log("one product added");
    // })

    console.log('database connected');
//   client.close();
});


app.listen(4000);