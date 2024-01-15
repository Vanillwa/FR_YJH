function person(name, age, cute){
    this.name = name
    this.age = age
    this.cute = cute
}

person1 = new person('홍길동', 30, true)
person2 = new person('김자바', 24, false)

console.log(person1)
console.log(person2)

let {name, age} = person1
console.log(name, age)

let arr = [1,2,3,4,5]
let [a,b,c,...abc] = arr;
console.log(a,b,c,abc);

let add = (x, y) => {
    return x+y;
}

console.log(add(1,2))

let obj1 = {
    title : 'obj1',
    showThis : function(){
        console.log(this)
    },
    showThis2 : () => {
        console.log(this)
    },
    showThis3 : function(){
        let showThis3_2 = () =>{
            console.log(this)
        }
        showThis3_2();
    }
}

obj1.showThis();
obj1.showThis2();
obj1.showThis3()

