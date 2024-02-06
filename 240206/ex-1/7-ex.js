fetch("https://1jsonplaceholder.typicode.com/users")
    .then((res) => res.text(), (error)=>{console.log('fail')})
    .then((result) => {console.log(result)})