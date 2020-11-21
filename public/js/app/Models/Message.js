class Message {
    constructor(from, target, message, date, timestemp){
        this.from = from;
        this.target = target;
        this.message = message;
        this.isNew = true;
        this.date = date;
        this.timestemp = timestemp
    }
}

module.exports = {Message};