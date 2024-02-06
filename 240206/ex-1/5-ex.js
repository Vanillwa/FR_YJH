// promise 객체
// 통신이 성공할 수도 실패할 수도 있습니다. 슈뢰딩거의 통신

// fetch함수의 리턴값은 promise 객체
// then 메서드는 fetch가 pending에서 fufilled (정상처리)가 되었을 경우 실행할 콜백함수

fetch("https://jsonplaceholder.typicode.com/users")
    .then(res =>{
        let i = res.text();
        console.log(typeof(i))
        return i
    })
    .then(result => JSON.parse(result)[0])
    .then(user => user.address)
    .then(addr => console.log(addr))

