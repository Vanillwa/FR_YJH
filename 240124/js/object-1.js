const item = {
    name : 'coat',
    price : 15000
}

function User(name, age){
    this.name = name;
    this.age = age;
    User.prototype.print = function(){
        console.log(`이름 : ${this.name} / 나이 : ${this.age}`);
    }
}

let 홍길동 = new User('홍길동', 22);

홍길동.print()


function createUser(id, pw){
	let user = {
		id,
		pw,
        print : function(item){
            console.log(`${this.id} / ${item.name}`)
        }
	}
	return user;
}

let user1 = createUser('홍길동', '1234');

console.log(user1)

user1.print(item);