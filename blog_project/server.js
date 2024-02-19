const express = require("express");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const models = require("./models");
const nodemailer = require("nodemailer");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(
    session({
        secret: "1111",
        resave: true,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
    })
);
app.use(passport.session());

passport.use(
    new localStrategy(
        {
            usernameField: "email",
            passwordField: "pwd",
        },
        async (email, pwd, done) => {
            let result = await models.member.findOne({
                where: { email: email },
            });
            if (!result) {
                return done(null, false, { message: "fail" });
            }
            if (result.pwd != pwd) {
                return done(null, false, { message: "pwd-fail" });
            }
            return done(null, result);
        }
    )
);

passport.serializeUser((user, done) => {
    process.nextTick(() => {
        done(null, { id: user.id, email: user.email, nickname: user.nickname });
    });
});

passport.deserializeUser(async (user, done) => {
    let result = await models.member.findOne({ where: { id: user.id } });
    if (result) {
        process.nextTick(() => {
            return done(null, {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
            });
        });
    }
});

const smtpTransPort = nodemailer.createTransport({
    pool: true,
    maxConnections: 1,
    service: "naver",
    host: "smtp.naver.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: "wjdgus3044@naver.com",
        pass: "yjh40523263!@",
    },
    tls: {
        rejectUnauthorized: false,
    },
});

app.listen(8081, () => {
    console.log("server on http://localhost:8081/");
});

app.get("/", (req, res) => {
    res.render("index", { user: req.user });
});

app.get("/login", (req, res) => {
    let path = req.query.path || "/";
    if (req.user) {
        // 이미 로그인 했다면 빠꾸
        res.redirect(path);
    } else {
        res.render("login-form", { path });
    }
});

app.post("/login", (req, res) => {
    // 로그인 검증
    passport.authenticate("local", (error, user, info) => {
        if (error) return res.status(500).json(error);

        if (!user) return res.status(401).send(info.message);

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).send("success");
        });
    })(req, res);
});

app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/login");
    });
});

app.get("/board", async (req, res) => {
    // 게시판 조회
    let page = req.query.page ? req.query.page : 1;
    let limit = 5;
    let totalPost = await models.board.count();
    let totalPage = Math.ceil(totalPost / limit);
    if (page > totalPage) {
        page = totalPage;
    }

    let offset = (page - 1) * limit;

    const boardList = await models.board.findAll({
        include: [
            {
                model: models.member,
                attributes: ["nickname"],
            },
        ],
        order: [["id", "DESC"]],
        offset,
        limit,
    });
    res.render("board", { user: req.user, boardList, totalPage });
});

app.get("/board/post", (req, res) => {
    // 게시글 작성 페이지
    if (req.user) {
        res.render("board-insert", { user: req.user });
    } else {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write("<script>alert('로그인이 필요한 서비스입니다')</script>");
        res.write("<script>location.href='/login'</script>");
    }
});

app.post("/board/post", async (req, res) => {
    // 글 insert
    await models.board
        .create(req.body)
        .then(() => {
            res.redirect("/board");
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.get("/board/:id", async (req, res) => {
    // 글 상세 뷰
    const { id } = req.params;

    try {
        let data = await models.board.findOne({
            include: [
                {
                    model: models.member,
                    attributes: ["nickname"],
                },
            ],
            where: { id: id },
        });
        res.render("board-view", { data, user: req.user });
    } catch {
        res.status(500).send("error");
    }
});

app.delete("/board/:id", async (req, res) => {
    const { id } = req.params;

    await models.board
        .destroy({ where: { id: id } })
        .then(() => {
            res.send("success");
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.get("/board/:id/update", async (req, res) => {
    const { id } = req.params;

    let postData = await models.board.findByPk(id).catch((error) => {
        return res.status(500).send(error);
    });

    if (!req.user) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write("<script>alert('로그인이 필요한 서비스입니다')</script>");
        res.write("<script>location.href='/login'</script>");
        return;
    } else if (postData.writer != req.user.id) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write(
            "<script>alert('본인이 작성한 글만 수정이 가능합니다')</script>"
        );
        res.write("<script>location.href='/board'</script>");
        return;
    }

    res.render("board-update", { data: postData, user: req.user });
});

app.put("/board/:id", async (req, res) => {
    const { id } = req.params;

    await models.board
        .update(req.body, { where: { id: req.body.id } })
        .then(() => {
            res.redirect("/board");
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.get("/signup", (req, res) => {
    res.render("signup-form");
});

app.post("/emailCheck", async (req, res) => {
    let { email } = req.body;
    let result = await models.member.findOne({ where: { email } });
    if (result) {
        return res.send("used");
    } else {
        return res.send("available");
    }
});

app.post("/emailVerify", async (req, res) => {
    const number = Math.floor(100000 + Math.random() * 900000);
    req.session.verifyNum = number;

    const { email } = req.body; //사용자가 입력한 이메일

    const mailOptions = {
        from: "wjdgus3044@naver.com", // 발신자 이메일 주소.
        to: email, //사용자가 입력한 이메일 -> 목적지 주소 이메일
        subject: " 인증 관련 메일 입니다. ",
        html: "<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>" + number,
    };
    smtpTransPort.sendMail(mailOptions, (err, response) => {
        console.log("response", response);
        //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
        if (err) {
            res.json({ message: "fail" });
            smtpTransport.close(); //전송종료
            return;
        } else {
            res.json({ message: "success" });
            smtpTransport.close(); //전송종료
            return;
        }
    });
});

app.post("/verifyNumCheck", (req, res) => {
    const { number } = req.body;
    const verifyNum = req.session.verifyNum;
    console.log("verifyNum : " + verifyNum);
    console.log("number : " + number);
    if (number == verifyNum) {
        return res.send("success");
    } else {
        return res.send("fail");
    }
});

app.post("/nicknameCheck", async (req, res) => {
    const { nickname } = req.body;
    let result = await models.member.findOne({ where: { nickname } });
    if (result) {
        return res.send("used");
    } else {
        return res.send("available");
    }
});

app.post('/signup', async (req, res)=>{
    await models.member
        .create(req.body)
        .then(() => {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.write("<script>alert('성공적으로 회원가입이 되었습니다.')</script>");
            res.write("<script>location.href='/login'</script>");
            return;
        })
        .catch((error) => {
            res.status(500).send(error);
        });
})
