export default class Budget {
    constructor() {
        this.owner = "";

        //we want to store the dialy, weekly, and monthly budgets into the budget object
        this.daily;
        this.weekly;
        this.monthly;

        //we want to be able to modify the budget and calculate remaining budgets
        this.remainingDaily;
        this.remainingWeekly;
        this.remainingMonthly;

        //we want to track expenses
        this.expenseHistory = new Map();
    }
}