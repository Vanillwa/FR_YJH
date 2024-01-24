class User{
    constructor(name, age){
        this.name = name;
        this.age = age;
    }

    printInfo(){
        console.log(`name : ${this.name}\nage : ${this.age}`);
    }
}

let user1 = new User('홍길동', 30);
user1.printInfo();

class VipUser extends User{
    constructor(name, age, grade){
        super(name, age)
        this.grade = grade;
    }

    printInfo(){
        console.log(`name : ${this.name}\nage : ${this.age}\ngrade : ${this.grade}`);
    }
}

let user2 = new VipUser('김자바', 30, 'vip');
user2.printInfo();