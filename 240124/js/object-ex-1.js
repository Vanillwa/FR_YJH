function makeCar(color, speed){
    let car = {
        color,
        speed,
        run(){
            console.log(`color : ${this.color}\nspeed : ${this.speed}`);
        }
    }
    return car;
}

let myCar = makeCar('red', 120);

myCar.run();

class Car{
    constructor(color, speed){
        this.color = color;
        this.speed = speed;
    }
    run(){
        console.log(`color : ${this.color}\nspeed : ${this.speed}`);
    }
}

let myCar2 = new Car('yellow', 150);

myCar2.run();