const express = require("express");
const app = express();

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
        }).catch(error =>{
            console.error("조회 에러 발생", error)
            res.status(500).send("조회 에러 발생")
        })
    }else{
        await models.Member.findAll({
            where : {team : team}
        }).then((data)=>{
            res.render('member', {data})
        }).catch(error =>{
            console.error("조회 에러 발생", error)
            res.status(500).send("조회 에러 발생")
        })
    }
})

app.get('/member/:id/view', async(req, res)=>{
    let {id} = req.params
    await models.Member.findByPk(id).then((data)=>{
        res.render('member-view', {data})
    }).catch(error =>{
        console.error("조회 에러 발생", error)
        res.status(500).send("조회 에러 발생")
    })
})

app.get('/member/add', (req, res)=>{
    res.render('member-add')
})

app.post('/member/add', async(req, res)=>{
    await models.Member.create(req.body).then(()=>{
        res.redirect('../member')
    }).catch(error =>{
        console.error("추가 에러 발생", error)
        res.status(500).send("추가 에러 발생")
    })
})

app.delete('/member/:id', async(req, res)=>{
    let {id} = req.params
    await models.Member.destroy({
        where : {id : id}
    }).then(()=>{
        res.redirect('/member');
    }).catch(error =>{
        console.error("삭제 에러 발생", error)
        res.status(500).send("삭제 에러 발생")
    })
})

app.get('/member/:id/update', async(req, res)=>{
    let {id} = req.params
    await models.Member.findByPk(id).then((data)=>{
        if(data){
            res.render('member-update', {data})
        }else{
            res.send('조회 오류');
        }
    }).catch(error =>{
        console.error("조회 에러 발생", error)
        res.status(500).send("조회 에러 발생")
    })
})

app.put('/member/:id', async(req, res)=>{
    let {id} = req.params
    await models.Member.update(req.body, {where : {id : id}}).then(()=>{
        res.redirect('/member')
    }).catch(error =>{
        console.error("수정 에러 발생", error)
        res.status(500).send("수정 에러 발생")
    })
})