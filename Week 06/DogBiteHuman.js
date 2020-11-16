class Human {
    constructor(name, height, weight, gender){
      this.name = name;
      this.height = height;
      this.weight = weight;
      this.gender = gender;
    }
    hurt(damage){
      console.log("Bit by dog. Hurt:" + damage);
    }
}
  
class Dog {
    constructor(name, height, weight, color, gender){
        this.name = name;
        this.height = height;
        this.weight = weight;
        this.color = color;
        this.gender = gender;
    }
}