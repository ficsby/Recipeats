export default class FoodList {
    constructor() {
        this.owner = "";

        //pull the foodList map from firebase and store as a map
        this.list = new Map();
    }
}

