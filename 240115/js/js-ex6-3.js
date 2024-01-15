
//함수 선언식
function f1(){ 
    console.log('f1 called')
    console.log(`일반적 함수 선언의 this : ${this}`)
}

//함수 표현식
let f2 = ()=>{
    console.log('f2 called')
    console.log(`화살표 함수의 this : ${this}`)
}

document.getElementById('btn1').addEventListener('click', f1); // this = btn1
document.getElementById('btn2').addEventListener('click', f2); // this = window

if(true){
    function f3(){
        console.log('f3 called')
    }
}
f3(); //실행 가능

if(true){
    let f4 = ()=>{
        console.log('f4 called')
    }
}
//f4(); - 실행 불가