class BankAccount {
  constructor(name, money) {
    this.holder = name;
    this.balance = money;
  }

  get balance() {
    return this._balance;
  }

  set balance(money) {
    if (money >= 0) {
      this._balance = money;
    } else {
      console.log('Not valid');
    }
  }

  deposit(money) {
    this.balance += money;
  }

  withdraw(money) {
    if (this.balance - money < 0) {
      console.log('Insufficient balance');
    } else {
      this.balance -= money;
    }
  }

  transfer(money, anotherAccount) {
    const account = anotherAccount;
    if (this.balance - money < 0) {
      console.log('Insufficient balance');
    } else {
      this.balance -= money;
      account.balance += money;
    }
  }
}

class SavingsAccount extends BankAccount{ 
  constructor(name, money){
    super(name, money);
    this.year = 0
  }

  addInterest(rate){
    this.balance *= ((rate * this.year) + 1);
  }
}

class DonationAccount extends BankAccount{
  constructor(name, money, rate){
    super(name, money);
    this.rate = rate;
  }

  donate(){
    this.balance *= (1 - this.rate);
  }
}

const ba1 = new BankAccount('Tom', 2000);
const sa1 = new SavingsAccount('Jerry', 1000);
const da1 = new DonationAccount('Kate', 3000);
const sa2 = new SavingsAccount('Alice', 9000);

const accountForVacation = new BankAccount('Vacation', 0);

let acc_list = [ba1, sa1, da1, sa2];

acc_list.forEach((el) => {
  el.transfer(800, accountForVacation);
  console.log(`name : ${el.holder} / balance : ${el.balance}`)
})

console.log('Vacation Account : '+accountForVacation.balance);