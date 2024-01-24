class User{
    constructor(email, birth){
        this.email = email;
        this.birth = birth;
    }

    get email(){
        return this._email;
    }

    set email(email){
        if(email.includes('@')){
            this._email = email;
        }else{
            return;
        }
    }

    printInfo(){
        console.log(`email : ${this.email}\nbirth : ${this.birth}`);
    }
}

let user1 = new User('test@gmail.com', '2001-12-24');
user1.email = 'hacked'

