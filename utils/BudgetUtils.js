import * as firebase from "firebase";
import Budget from "../data/Budget";

export const calculateBudgets = (dailyBudget) => {
    var monthsWith31 = new Array(0, 2, 4, 6, 7, 9, 11);
    var monthsWith30 = new Array(3, 5, 8, 10);
    var currentDate = new Date();
    var resultBudget = new Budget();

    var currentMonth = currentDate.getMonth();

    var weeklyBudget = dailyBudget * 7;
    
    if(monthsWith31.includes(currentMonth))
    {
        var monthlyBudget = dailyBudget * 31;
    }
    else if(monthsWith30.includes(currentMonth))
    {
        var monthlyBudget = dailyBudget * 30;
    }
    else
    {
        var monthlyBudget = dailyBudget * 28;
    }

    resultBudget.weekly = weeklyBudget;
    resultBudget.monthly = monthlyBudget;
    return resultBudget;
},

