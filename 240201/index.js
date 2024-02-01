const express = require('express');
const app = express();

const mysql = require('mysql');
const dbConfig = {
    host : 'localhost',
    port : '3306',
    user : 'root',
    password : '1111',
    database : 'test',
    dateStrings: 'date'
};

const db = mysql.createConnection(dbConfig);

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.listen(8081, ()=>{
    console.log('server on - http://localhost:8081');
})

app.get('/', (req, res)=>{
    res.render('main.ejs')
})

app.get('/member', (req, res)=>{
    let sql = 'SELECT * FROM member';

    db.query(sql, (error, rows)=>{
        if(error)
            console.log(error);

        res.render('member.ejs', {person : rows})
    })
})

app.get('/shop', (req, res)=>{
    res.render('shop.ejs')
})

app.get('/contact', (req, res)=>{
    res.render('contact.ejs')
})