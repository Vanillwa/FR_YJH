fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.text())
    .then((result) => {
        const users = JSON.parse(result);
        const {id} = users[0];
        return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`)
    })
    .then(res => res.text())
    .then(post => console.log(post))
