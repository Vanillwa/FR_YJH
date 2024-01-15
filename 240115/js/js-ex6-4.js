function f1(){
    console.log('f1 called')
    console.log(this)
}
f1(); // this : window

let obj1 = {
    f2 : function(){
        console.log('f2 called')
        console.log(this)
    },
    f3 : ()=>{
        console.log('f3 called')
        console.log(this)
    }
}

obj1.f2(); // this : obj1
obj1.f3(); // this : window 
// 화살표 함수는 this를 바인딩 하지 않으며 this를 사용할 경우 상위 스코프의 this를 사용할 수 있다


function f4(){ 
    console.log('f4 called')
    console.log(`일반적 함수 선언의 this : ${this}`)
}

//함수 표현식
let f5 = ()=>{
    console.log('f5 called')
    console.log(`화살표 함수의 this : ${this}`)
}

document.getElementById('btn1').addEventListener('click', f4); // this = btn1
document.getElementById('btn2').addEventListener('click', f5); // this = window