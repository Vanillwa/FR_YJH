console.log("start");

fetch("https://jsonplaceholder.typicode.com/users/1")
    .then((res) => res.text())
    .then((result) => console.log(JSON.parse(result).name));

console.log("end");

let i = 0;
setInterval(() => {
    console.log(i*i++);
}, 1);
