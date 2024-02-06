fetch('https://www.google.com')
    .then((res)=>{
        return res.text();
        // fetch를 통해 얻어온 res(response)는 응답받은 내용뿐만 아니라 각종 부가 정보들이 함께 들어있다.
        // 그러므로 fetch의 결과값만 보고 싶다면 response.text() 를 통해 알 수 있다.
    })
    .then((result)=>{
        //console.log(result);
    })