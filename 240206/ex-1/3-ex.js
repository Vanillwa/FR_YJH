const newMember = {
    name: "수정댐",
    email: "put@korea.com",
    department: "put",
};

// fetch("https://learn.codeit.kr/api/members")
//     .then((res) => res.text())
//     .then((result) => console.log(result));

// fetch("https://learn.codeit.kr/api/members",{
//     method : 'post',
//     body : JSON.stringify(newMember),
//     header : {
//         'Content-Type' : 'application/json'
//     }
// })
//     .then((res) => res.text())
//     .then((result) => console.log(result));

fetch("https://learn.codeit.kr/api/members",{
    method : 'get'
})
    .then((res) => res.text())
    .then((result) => console.log(result));

