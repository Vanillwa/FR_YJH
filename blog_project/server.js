const express = require('express')
const session = require('express-session');
const app = express()

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.json()); 
app.use(express.urlencoded({extended : true}));
app.use(session({
    secret: 'sk',
    resave: false,
    saveUninitialized: false
}));

const models = require("./models");

app.listen(8081, ()=>{
    console.log('server on http://localhost:8081/');
})

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/login', (req, res)=>{
    res.render('login-form')
})

app.post('/login', async (req, res)=>{
    let email = req.body.email
    let pwd = req.body.pwd

    let account = await models.member.findOne({where : {email : email}})
    
    if(account){
        if(account.pwd == pwd){
            res.status(200).send('success')
        }else{
            res.status(200).send('pwd-fail')
        }
    }else{
        res.status(200).send('fail')
    }
})