const express = require("express");
const session = require("express-session");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "sk",
        resave: true,
        saveUninitialized: true,
    })
);

const models = require("./models");

app.listen(8081, () => {
    console.log("server on http://localhost:8081/");
});

app.get("/", (req, res) => {
    res.render("index", {userData : req.session.user});
});

app.get("/login", (req, res) => { // 로그인 페이지
    if (req.session.user) { // 이미 로그인 했다면 빠꾸
        console.log("already login");
        res.redirect("/");
    }else{
        res.render("login-form");
    }
});

app.post("/login", async (req, res) => { // 로그인
    if (req.session.user) { // 이미 로그인 했다면 빠꾸
        console.log("already login");
        res.redirect("/");
    } else { // 로그인 검증
        const email = req.body.email;
        const pwd = req.body.pwd;
        let account

        try{
            account = await models.member.findOne({ where: { email: email } })
        }catch{
            res.status(500).send("error")
        }

        if (account) {
            if (account.pwd == pwd) { // 비밀번호가 맞다면
                req.session.user = account; // 세션에 로그인정보 저장
                res.status(200).send("success");
            } else { // 비밀번호 다름
                res.status(200).send("pwd-fail");
            }
        } else { // 계정 없음
            res.status(200).send("fail");
        }
    }
});

app.get('/logout', (req, res)=>{ // 로그아웃
    if(req.session.user){
        req.session.destroy()
        res.redirect('/')
    }
})

app.get('/board', async (req, res)=>{ // 게시판 조회
    let page = (req.query.page) ? req.query.page : 1
    let limit = 5
    let offset = (page -1) * limit
    let totalPost = await models.board.count()
    let totalPage = Math.ceil(totalPost/limit)

    const boardList = await models.board.findAll({
        include : [{
            model : models.member,
            attributes : ['nickname']
        }],
        order : [[ 'id' , 'DESC']],
        offset,
        limit
    })
    res.render('board', {userData : req.session.user, boardList, totalPage})
})

app.get('/board/post', (req, res)=>{ // 게시글 작성 페이지
    if(req.session.user){
        res.render('board-insert', {userData : req.session.user})
    }else{
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write("<script>alert('로그인이 필요한 서비스입니다')</script>");
        res.write("<script>location.href='/login'</script>");
    }
})

app.post('/board/post', async (req, res)=>{ // 글 insert
    await models.board.create(req.body).then(()=>{
        res.redirect('/board')
    }).catch((error)=>{
        res.status(500).send(error)
    })
})

app.get('/board/:id', async(req, res)=>{ // 글 상세 뷰
    const {id} = req.params

    try{
        let data = await models.board.findByPk(id)
        res.render('board-view', {data, userData : req.session.user})
    }catch{
        res.status(500).send('error')
    }
})

app.delete('/board/:id', async(req, res)=>{
    const {id} = req.params
    if(!req.session.user || req.session.user.id != id){ // 로그인 안했으면 빠꾸
        res.status(200).send('fail')
    }

    await models.board.destroy({where : {id : id}}).then(()=>{
        res.status(200).send('success')
    }).catch((error)=>{
        res.status(500).send(error)
    })
})