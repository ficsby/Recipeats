export default class Macro {
    constructor() {
        this.owner = "";

        this.calories;
        this.carbs;
        this.fats;
        this.protein;

        this.userGoals = [this.calories, this.carbs, this.fats, this.protein];

        //there will probably be attributes to save remaining macros
    }
}