// npm init -y
// npm install express -> express 라이브러리 설치

const express = require('express'); // express 라이브러리 호출
const app = express();

// static file 경로
app.use(express.static(__dirname + '/public'));

// view engine as ejs
app.set('view engine', 'ejs')

// server on
app.listen(8081, () => {
    console.log('server on : 8081port');
});

// app.get('경로', (요청, 응답) => {내용})
// html 파일 연결 / 응답.sendFile(__dirname + '/파일이름.확장자');
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
})

app.get('/board', async(request, response) => {
    let result = await db.collection('member').find().toArray();
    response.render('board.ejs', {member : result});
})

// mongodb 연결
const {mongoClient, MongoClient} = require('mongodb');

let db;
const url = 'mongodb+srv://admin:1111@cluster0.fhcel0y.mongodb.net/?retryWrites=true&w=majority';
new MongoClient(url).connect().then((client)=>{
    console.log('db connected');
    db = client.db('member');
}).catch(()=>{
    console.log('connecting error occured');
});

