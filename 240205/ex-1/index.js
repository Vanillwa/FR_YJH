// express 불러오기
const express = require('express');
let app = express();

// db 접속 config 작성
let dbConfig = require('./dbConfig')

// mysql 불러온 후 위에서 작성한 config로 접속
const mysql = require('mysql2');
let db = mysql.createConnection(dbConfig);

// css와 각종 파일을 저장할 static 폴더 지정
app.use(express.static(__dirname+'/public'));

// ejs를 view engine으로 사용하겠다
app.set('view engine', 'ejs');

// post형식으로 데이터 전송할 때 값을 읽기 위해 parsing
app.use(express.json()); // json 형태로 데이터 처리
app.use(express.urlencoded({extended : true})); //queryString 방식으로 데이터 이동

// 8081 포트를 사용하겠다
app.listen(8081, ()=>{
    console.log('server on http://localhost:8081/');
})

// main 페이지
app.get('/', (req, res)=>{
    res.render('main')
})

// member 페이지
app.get('/member', (req, res)=>{

    // 전체 member 조회 쿼리문
    let sql = 'SELECT * FROM member';

    // 위에서 작성한 쿼리문 실행
    db.query(sql, (error, data)=>{

        // 에러 던지기
        if(error) console.log(error);

        // 조회한 데이터를 member 페이지에 data 라는 이름으로 가지고 가기
        res.render('member', {data});
    });
})

// member 추가 페이지
app.get('/member/add', (req, res)=>{
    res.render('member-add');
})

// member 추가하기
app.post('/member-add', (req, res)=>{

    // 신규 멤버 insert 쿼리문
    let sql = 'INSERT INTO member VALUES(NULL, ?, ?, NULL, NULL, NULL, ?, now(), NULL)';

    // form태그로 받아온 데이터를 배열 형태로 변환
    let values = Object.values(req.body);

    // 위의 쿼리문과 받아온 values를 바탕으로 insert 쿼리문 실행
    db.query(sql, values, (error, result)=>{

        // 오류 던지기
        if(error) throw error;
        console.log('insert success');
    })

    // 전체 멤버 조회 페이지로 리다이렉트
    res.redirect('member');
})

app.get('/delete', (req, res)=>{
    let id = req.query.id;
    let sql = 'DELETE FROM member WHERE id = ?';

    db.query(sql, id, (error, result)=>{
        if(error) throw error;
        console.log('delete success');
    })

    res.redirect('member');
})