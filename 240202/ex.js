let 기존 = ['이수', '사당', '강남'];
let 신규 = ['부평', '신도림'];
let 전체 = [...기존, ...신규];

for(let i of 전체){
    console.log(i);
}