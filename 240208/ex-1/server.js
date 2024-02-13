const express = require("express");
const app = express();
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mysql = require("mysql2");
const dbConfig = require("./dbConfig");
const db = mysql.createConnection(dbConfig);
const models = require("./models");

app.listen(8081, () => {
    console.log("server on http://localhost:8081/");
});

app.get("/", (req, res) => {
    res.render("index")
});

app.get('/member', async(req, res)=>{
    let team = req.query.team
    if(team == undefined || team == ''){
        await models.Member.findAll().then((data)=>{
            res.render('member', {data})
        })
    }else{
        await models.Member.findAll({
            where : {team : team}
        }).then((data)=>{
            res.render('member', {data})
        })
    }
})

app.get('/member/:id/view', async(req, res)=>{
    let {id} = req.params
    await models.Member.findByPk(id).then((data)=>{
        res.render('member-view', {data})
    })
})

app.get('/member/add', (req, res)=>{
    res.render('member-add')
})

app.post('/member/add', async(req, res)=>{
    await models.Member.create(req.body).then(()=>{
        res.redirect('../member')
    }).catch(error => {
        console.log('error occured');
    })
})

app.delete('/member/:id', async(req, res)=>{
    let {id} = req.params
    await models.Member.destroy({
        where : {id : id}
    }).then(()=>{
        res.redirect('/member');
    })
})

app.get('/member/:id/update', async(req, res)=>{
    let {id} = req.params
    await models.Member.findByPk(id).then((data)=>{
        res.render('member-update', {data})
    })
})

app.put('/member/:id', async(req, res)=>{
    let {id} = req.params
    await models.Member.update(req.body, {where : {id : id}}).then(()=>{
        res.redirect('/member')
    })
})