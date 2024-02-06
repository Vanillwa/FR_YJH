// fetch("https://jsonplaceholder.typicode.com/users")
//     .then((res) => res.text())
//     .then((result) => {
//         const user = JSON.parse(result); // json 데이터를 js 객체로 변환
//         console.log(user.length);
//         user.forEach((element) => {
//             console.log(element);
//         });
//     });

fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.text())
    .then((result) => {const user = result; console.log(user)});

    