// Dependencies
let Discord = require('discord.js');
var add = require('date-fns/add');
var startOfHour = require('date-fns/startOfHour')
var setHours = require('date-fns/setHours')
var differenceInHours = require('date-fns/differenceInHours')
var isThisHour = require('date-fns/isThisHour')
var isPast = require('date-fns/isPast')
var isFuture = require('date-fns/isFuture')

// Inherits from Discord.js Client
class TaBot extends Discord.Client {
    constructor(options) {
        // Running Parent Class Constructor
        super();
        // Defining Member Function for Server Connection
        this.on('ready', this.handleConnect);
        // Defining Member Function for Message Event
        this.on('message', this.handleMessage);
        // Lab Hours
        this.setUpHours();
    }

    handleConnect() {
        console.log('Logged in as BOT');
    }

    // Upon Discord Message
    async handleMessage(message) {
        // Check if its a relevent command.
        if (message.content.substring(0, 1) != '/') return;
        // Parse Arguments
        let args = message.content.substring(1).split(' ');
        let cmd = args[0];
        args = args.splice(1);
        // split commands
        switch(cmd) {
            case 'help':
                this.help(message);
                break;
            case 'exception':
                this.exception(message);
                break;
            case 'taschedule':
                this.ta(message);
                break;
            default:
                this.invalidCommand(message);
                break;
        }
    }

    invalidCommand(message) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Oops! Invalid Command')
        .setColor(0xfa572a)
        .setDescription('Try `/help`');
        message.reply(embed);
        return false;
    }

    help(message) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Available Commands')
        .setColor(0x2bff99)
        .setDescription('`/help`: Displays available Commands.\n`/ta`: Shows current or next TA scheduled and any exceptions.');
        message.reply(embed);
        return false;
    }

    exception(message) {
        message.reply("Exception Command");
        return false;
    }

    ta(message) {
        let now = new Date();
        let current = null;
        let nextClosest = null;
        let distance = 10000000;
        let nextNextClosest = null;
        let nextDistance = 10000000;
        for (let i = 0; i < this.hours.length; i++) {
            while (isPast(this.hours[i].time) && !isThisHour(this.hours[i].time)) {
                console.log("MOVING", this.hours[i], this.hours[i].time.getHours());
                this.hours[i].time = add(this.hours[i].time, { weeks: 1 });
            }
            if (isThisHour(this.hours[i].time)) {
                current = this.hours[i];
            } else if (isFuture(this.hours[i].time) && differenceInHours(now, this.hours[i].time) < distance) {
                distance = differenceInHours(now, this.hours[i].time);
                nextClosest = this.hours[i];
            } else if (isFuture(this.hours[i].time) && differenceInHours(now, this.hours[i].time) < nextDistance) {
                nextDistance = differenceInHours(now, this.hours[i].time);
                nextNextClosest = this.hours[i];
            }
        }

        console.log(current);
        console.log(nextClosest);
        console.log(nextNextClosest);
        let returnMessage = "";
        if (current != null) {
            returnMessage += "Ta's Available: ";
            for (let i = 0; i < current.ta.length; i++) {
                returnMessage += current.ta[i];
                if (i < current.ta.length - 1) {
                    returnMessage += ",";
                }
            }
        }
        
        const embed = new Discord.MessageEmbed()
        .setTitle('TA Availability')
        .setColor(0x25faf6)
        .setDescription(returnMessage);
        message.reply(embed);
        return false;
    }

    async setUpHours() {
        this.hours = [
            {time: this.getTime(1, 8), ta: ["Luke"]},
            {time: this.getTime(1, 9),  ta: ["Connor", "Luke"]},
            {time: this.getTime(1, 10),  ta: ["Connor", "Luke"]},
            {time: this.getTime(1, 12),  ta: ["Connor"]},
            {time: this.getTime(1, 14),  ta: ["Connor"]},
            {time: this.getTime(1, 15),  ta: ["Casey"]},
            {time: this.getTime(1, 16),  ta: ["Casey"]},
            {time: this.getTime(2, 8),  ta: ["Katy"]},
            {time: this.getTime(2, 10),  ta: ["Andrew"]},
            {time: this.getTime(2, 12),  ta: ["Katy"]},
            {time: this.getTime(2, 18),  ta: ["Bethany"]},
            {time: this.getTime(3, 8),  ta: ["Luke"]},
            {time: this.getTime(3, 9),  ta: ["Connor", "Luke"]},
            {time: this.getTime(3, 10),  ta: ["Connor", "Luke"]},
            {time: this.getTime(3, 11),  ta: ["Connor", "Luke"]},
            {time: this.getTime(3, 12),  ta: ["Connor", "Andrew"]},
            {time: this.getTime(3, 13),  ta: ["Connor", "Andrew"]},
            {time: this.getTime(3, 15),  ta: ["Casey"]},
            {time: this.getTime(3, 16),  ta: ["Casey"]},
            {time: this.getTime(3, 17),  ta: ["Trevor"]},
            {time: this.getTime(3, 18),  ta: ["Trevor"]},
            {time: this.getTime(4, 8),  ta: ["Luke"]},
            {time: this.getTime(4, 9),  ta: ["Luke"]},
            {time: this.getTime(4, 10),  ta: ["Andrew"]},
            {time: this.getTime(4, 11),  ta: ["Andrew", "Katy"]},
            {time: this.getTime(4, 12),  ta: ["Katy"]},
            {time: this.getTime(4, 15),  ta: ["Trevor"]},
            {time: this.getTime(4, 16),  ta: ["Trevor"]},
            {time: this.getTime(4, 17),  ta: ["Bethany"]},
            {time: this.getTime(4, 18),  ta: ["Bethany"]},
            {time: this.getTime(5, 8),  ta: ["Luke"]},
            {time: this.getTime(5, 9),  ta: ["Luke", "Katy"]},
            {time: this.getTime(5, 10),  ta: ["Katy"]},
            {time: this.getTime(5, 15),  ta: ["Bethany"]},
            {time: this.getTime(5, 16),  ta: ["Bethany"]},
            {time: this.getTime(5, 17),  ta: ["Bethany"]},
            {time: this.getTime(6, 10), ta: ["Casey"]},
            {time: this.getTime(6, 11),  ta: ["Casey"]},
            {time: this.getTime(6, 12),  ta: ["Casey"]},
        ];
        // this.hours = [
        //     {time: this.getTime(1, 8), ta: ["Luke"]},
        //     {time: this.getTime(1, 9),  ta: ["Connor", "Luke"]},
        //     {time: this.getTime(1, 10),  ta: ["Connor", "Luke"]},
        //     {time: this.getTime(1, 12),  ta: ["Connor"]},
        //     {time: this.getTime(1, 13),  ta: ["Connor"]},
        //     {time: this.getTime(1, 15),  ta: ["Casey"]},
        //     {time: this.getTime(1, 16),  ta: ["Casey"]},
        //     {time: this.getTime(2, 8),  ta: ["Katy"]},
        //     {time: this.getTime(2, 10),  ta: ["Andrew"]},
        //     {time: this.getTime(2, 12),  ta: ["Katy"]},
        //     {time: this.getTime(2, 18),  ta: ["Bethany"]},
        //     {time: this.getTime(3, 8),  ta: ["Luke"]},
        //     {time: this.getTime(3, 9),  ta: ["Connor", "Luke"]},
        //     {time: this.getTime(3, 10),  ta: ["Connor", "Luke"]},
        //     {time: this.getTime(3, 11),  ta: ["Connor", "Luke"]},
        //     {time: this.getTime(3, 12),  ta: ["Connor", "Andrew"]},
        //     {time: this.getTime(3, 13),  ta: ["Connor", "Andrew"]},
        //     {time: this.getTime(3, 15),  ta: ["Casey"]},
        //     {time: this.getTime(3, 16),  ta: ["Casey"]},
        //     {time: this.getTime(3, 17),  ta: ["Trevor"]},
        //     {time: this.getTime(3, 18),  ta: ["Trevor"]},
        //     {time: this.getTime(4, 8),  ta: ["Luke"]},
        //     {time: this.getTime(4, 9),  ta: ["Luke"]},
        //     {time: this.getTime(4, 10),  ta: ["Andrew"]},
        //     {time: this.getTime(4, 11),  ta: ["Andrew", "Katy"]},
        //     {time: this.getTime(4, 12),  ta: ["Katy"]},
        //     {time: this.getTime(4, 15),  ta: ["Trevor"]},
        //     {time: this.getTime(4, 16),  ta: ["Trevor"]},
        //     {time: this.getTime(4, 17),  ta: ["Bethany"]},
        //     {time: this.getTime(4, 18),  ta: ["Bethany"]},
        //     {time: this.getTime(5, 8),  ta: ["Luke"]},
        //     {time: this.getTime(5, 9),  ta: ["Luke", "Katy"]},
        //     {time: this.getTime(5, 10),  ta: ["Katy"]},
        //     {time: this.getTime(5, 15),  ta: ["Bethany"]},
        //     {time: this.getTime(5, 16),  ta: ["Bethany"]},
        //     {time: this.getTime(5, 17),  ta: ["Bethany"]},
        //     {time: this.getTime(6, 10), ta: ["Casey"]},
        //     {time: this.getTime(6, 11),  ta: ["Casey"]},
        //     {time: this.getTime(6, 12),  ta: ["Casey"]},
        // ];
        this.exceptions = [];
    }

    getTime(day, hour) {
        let now = new Date();
        let differenceToZero = 7 - now.getDay();
        if (differenceToZero == 7) differenceToZero = 0;
        let date = add(now, { days: differenceToZero + day, weeks: -1 });
        date = setHours(date, hour);
        date = startOfHour(date);
        return date;
    }
}
module.exports = TaBot;