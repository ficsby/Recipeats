import FoodList from '../data/FoodList'

//compares two different FoodLists and
//returns a FoodList containing missing FoodItems
export const findMissing = (secondList) => {
    var myFoods = new FoodList();
    var missing = new Map();

    for (var [key, val] of secondList.list) {
        if (!myFoods.list.has(key)) {
            missing.set(key, val);
        }
    }

    return missing;
};