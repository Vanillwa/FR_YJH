const express = require('express');
const app = express();

app.listen(8081, ()=>{
    console.log('server on');
})

app.get('/', async(request, response)=>{
    let result = await db.collection('member').find().toArray();
    response.send(result[0]);
    response.sendFile(__dirname + '/index.html');
})

app.get('/about', (request, response)=>{
    response.sendFile(__dirname + '/about.html');
})

app.get('/shop', (request, response)=>{
    response.sendFile(__dirname + '/shop.html');
})

const {mongoClient, MongoClient} = require('mongodb');

let db;
const url = 'mongodb+srv://admin:1111@cluster0.fhcel0y.mongodb.net/?retryWrites=true&w=majority';
new MongoClient(url).connect().then((client)=>{
    console.log('db connected');
    db = client.db('member');
}).catch(()=>{
    console.log('error occured');
});

