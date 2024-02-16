const express = require("express");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const models = require("./models");
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

app.listen(8081, () => {
    console.log("server on http://localhost:8081/");
});

app.get("/", (req, res) => {
    res.render("index", { user: req.user });
});

app.get("/login", (req, res) => {
    let path = req.query.path || '/'
    if (req.user) {
        // 이미 로그인 했다면 빠꾸
        res.redirect(path);
    } else {
        res.render("login-form", {path});
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
