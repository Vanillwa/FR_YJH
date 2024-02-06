const express = require('express');
const app = express();
const port = 8081;

app.get('/', (req,res)=>{
    res.send('Hello Node.js!')
})

app.listen(port, ()=>{
    console.log('Server is running on ' + port);
})

const {MongoClient} = require('mongodb')
const url = 'mongo db url'
const dbName = 'member';

new MongoClient(url).connect().then((client)=>{
    console.log('db connected')
    let db = client.db(dbName)
}).catch(()=>{
    console.log('error occured')
})