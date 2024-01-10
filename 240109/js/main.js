import member from "./member.js";

console.log(`이름 : ${member[0].name} \n생일 : ${member[0].birth}`)

let tag ='';
for(let i of member){
    let gender = (i.gender) ? "남자" : "여자";
    let check = (i.check) ? " check" : "";
    tag += `<div class="box${check}">
                <p class="name">이름 : ${i.name}</p>
                <p class="birth">생일 : ${i.birth}</p>
                <p class="major">전공 : ${i.major}</p>
                <p class="hobby">취미 : ${i.hobby}</p>
                <p class="gender">성별 : ${gender}</p>
            </div>`
}
document.querySelector('.member .wrap').innerHTML = tag