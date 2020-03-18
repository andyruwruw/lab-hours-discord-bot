// Dependencies
let Discord = require('discord.js');
const mongoose = require("mongoose");
var add = require('date-fns/add');
var formatDistanceToNow = require('date-fns/formatDistanceToNow')
var isPast = require('date-fns/isPast')
var isFuture = require('date-fns/isFuture')
var sub = require('date-fns/sub')

// Connecting to database.
mongoose.connect('mongodb://localhost:27017/tabot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
let LabHour = require('./labhour.js');

/**
 * TaBot Class
 * Inherits from Discord.js Client
 */
class TaBot extends Discord.Client {
    /**
     * TaBot Constructor
     * Returns new instance of client.
     * 
     * @param {object} options Discord Secret token.
     */
    constructor(options) {
        super(options);
        this.on('ready', this.handleConnect);
        this.on('message', this.handleMessage);
    }

    /**
     * Handle Connect
     * Runs upon bot's connection to server.
     */
    handleConnect() {
        console.log('Logged in as BOT');
    }

    /**
     * Handle Message
     * Runs when bot sees a message. 
     * 
     * @param {class} message Discord.js message object.
     */
    async handleMessage(message) {
        // Checks if it's a command.
        if (message.content.substring(0, 1) != '/') return;
        // Parses arguments
        let args = message.content.substring(1).split(' ');
        let cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
            case 'help':
                this.help(message);
                break;
            case 'cancel':
                this.cancel(message, args);
                break;
            case 'uncancel':
                this.uncancel(message, args);
                break;
            case 'gethours':
                this.getHours(message, args);
                break;
            case 'taschedule':
                this.taSchedule(message);
                break;
            default:
                this.invalidCommand(message);
                break;
        }
    }

    /**
     * Invalid Message
     * Returns message stating error.
     * 
     * @param {class} message Discord.js message object.
     */
    invalidCommand(message) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Oops! Invalid Command')
        .setColor(0xfa572a)
        .setDescription('Try `/help`');
        message.reply(embed);
        return false;
    }

    /**
     * Help
     * Returns embed with available commands.
     * 
     * @param {class} message Discord.js message object.
     */
    help(message) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Available Commands')
        .setColor(0x2bff99)
        .setDescription('`/help`: Displays available Commands.\n`/taschedule`: Shows current or next TA scheduled and any exceptions.\n`/gethours name`: Shows a given TA\'s hours');
        message.reply(embed);
        return false;
    }

    /**
     * Get Hours
     * Returns message with a given TA's Hours
     * 
     * @param {class} message Discord.js message object.
     * @param {array} params Array of strings of other arguments from message.
     */
    async getHours(message, params) {
        try {
            let name = null;
            let returnMessage = "";
            if (params.length > 0) {
                name = params[0].charAt(0).toUpperCase() + params[0].substring(1);
                let days = ["**Sunday**", "**Monday**", "**Tuesday**", "**Wednesday**", "**Thursday**", "**Friday**", "**Saturday**"];
                let hours = await LabHour.find({
                    ta: name,
                });
                for (let i = 0; i < hours.length; i++) {
                    let old = false;
                    let start = new Date(hours[i].start);
                    let end = new Date(hours[i].end);
                    if (isPast(end)) {
                        start = add(start, { weeks: 1 });
                        end = add(end, { weeks: 1 });
                        await LabHour.updateOne({
                            _id: hours[i]._id,
                        }, {
                            $set: {
                                start: start,
                                end: end,
                                canceled: false,
                            }
                        });
                        old = true;
                    }
                    start = await sub(start, {minutes: 360});
                    end = await sub(end, {minutes: 360});
                    let day = start.getDay();
                    let hour = start.getHours();
                    let endHour = end.getHours();
                    returnMessage += days[day] + ": " + this.editHour(hour) + " to " + this.editHour(endHour);
                    if (hours[i].canceled && !old) {
                        returnMessage += " \nCANCELED: " + (start.getMonth() + 1) + "/" + start.getDate();
                    }
                    returnMessage += "\n";
                }
            } else {
                returnMessage = "**Error**: Provide a TA's Name.\n**Command**: `/gethours name`\n**Example**: `/gethours andrew`";
            }
            const embed = new Discord.MessageEmbed()
            .setTitle(name + '\'s Hours:')
            .setColor(0x25faf6)
            .setDescription(returnMessage);
            message.reply(embed);
        } catch (error) {
            const embed = new Discord.MessageEmbed()
            .setTitle('Bot Encountered an Error')
            .setColor(0x25faf6)
            message.reply(embed);
        }
    }

    editHour(hour) {
        if (hour >= 0 && hour < 12) {
            if ( hour == 0) {
                hour = 12;
            }
            return hour + "AM";
        } else {
            hour -= 12;
            return hour + "PM";
        }
    }

    /**
     * Un-Cancel Hours
     * Sets hours to "Not Canceled"
     * 
     * @param {class} message Discord.js message object.
     * @param {array} params Array of strings of other arguments from message.
     */
    async uncancel(message, params) {
        try {
            let returnMessage = "";
            if (params.length == 3) {
                let name = params[0].charAt(0).toUpperCase() + params[0].substring(1);
                let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
                const isSame = (element) => element == params[1];
                let dayIndex = days.findIndex(isSame);
                let event = null;
                if (dayIndex != -1) {
                    let hours = await LabHour.find({
                        ta: name,
                    });
                    for (let i = 0; i < hours.length; i++) {
                        let start = new Date(hours[i].start);
                        start = await sub(start, {minutes: 360});
                        let day = start.getDay();
                        let hour = start.getHours();
                        if (day == dayIndex && hour == parseInt(params[2], 10)) {
                            event = hours[i];
                            await LabHour.updateOne({
                                _id: hours[i]._id,
                            }, {
                                $set: {
                                    canceled: false,
                                }
                            });
                            break;
                        }
                    }
                    if (event) {
                        let start = new Date(event.start);
                        start = await sub(start, {minutes: 360});
                        let day = days[(start).getDay()].charAt(0).toUpperCase() + days[(start).getDay()].substring(1);
                        let hour = start.getHours();
                        returnMessage = "Success: Lab Hours at " + hour + " on " + day + " for **" + name + "** have been un-canceled";
                    } else {
                        returnMessage = "**Error**: No Lab Hour scheduled at that time.\n";
                    }
                } else {
                    returnMessage = "**Error**: Incorrect Day.\nTry: monday, tuesday, wednesday, thursday, friday, saturday";
                }
            } else {
                returnMessage = "**Error**: Forgot a parameter.\n**Command**:`/cancel name day hour`\n**Example:** `/cancel bob tuesday 14`";
            }
            const embed = new Discord.MessageEmbed()
            .setTitle('Un-Canceling Lab Hours:')
            .setColor(0x25faf6)
            .setDescription(returnMessage);
            message.reply(embed);
        } catch (error) {
            const embed = new Discord.MessageEmbed()
            .setTitle('Bot Encountered an Error')
            .setColor(0x25faf6)
            message.reply(embed);
        }
    }

    /**
     * Cancel Hours
     * Sets hours to "Canceled"
     * 
     * @param {class} message Discord.js message object.
     * @param {array} params Array of strings of other arguments from message.
     */
    async cancel(message, params) {
        try {
            let returnMessage = "";
            if (params.length == 3) {
                let name = params[0].charAt(0).toUpperCase() + params[0].substring(1);
                let ta = 1;
                let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
                const isSame = (element) => element == params[1];
                let dayIndex = days.findIndex(isSame);
                let event = null;
                if (ta != null) {
                    if (dayIndex != -1) {
                        let hours = await LabHour.find({
                            ta: name,
                        });
                        for (let i = 0; i < hours.length; i++) {
                            let start = new Date(hours[i].start);
                            start = await sub(start, {minutes: 360});
                            let day = start.getDay();
                            let hour = start.getHours();
                            if (day == dayIndex && hour == parseInt(params[2], 10)) {
                                event = hours[i];
                                await LabHour.updateOne({
                                    _id: hours[i]._id,
                                }, {
                                    $set: {
                                        canceled: true,
                                    }
                                });
                                break;
                            }
                        }
                        if (event) {
                            let start = new Date(event.start);
                            start = await sub(start, {minutes: 360});
                            let day = days[(start).getDay()].charAt(0).toUpperCase() + days[(start).getDay()].substring(1);
                            let hour = start.getHours();
                            returnMessage = "Success: Lab Hours at " + hour + " on " + day + " for **" + name + "** has been canceled";
                        } else {
                            returnMessage = "**Error**: No Lab Hour scheduled at that time.\n";
                        }
                    } else {
                        returnMessage = "**Error**: Incorrect Day.\nTry: monday, tuesday, wednesday, thursday, friday, saturday";
                    }
                } else {
                    returnMessage = "**Error**: TA does not exist.\nContact Andrew. He screwed up somewhere.";
                }
            } else {
                returnMessage = "**Error**: Forgot a parameter.\n**Cancel Command:**`/cancel name day hour`\n**Example:** /cancel bob tuesday 14";
            }
            const embed = new Discord.MessageEmbed()
            .setTitle('Canceling Lab Hours:')
            .setColor(0x25faf6)
            .setDescription(returnMessage);
            message.reply(embed);
            return false;
        } catch (error) {
            const embed = new Discord.MessageEmbed()
            .setTitle('Bot Encountered an Error')
            .setColor(0x25faf6)
            message.reply(embed);
        }
    }

    /**
     * Ta Schedule
     * Shows if TA is on duty or next available.
     * 
     * @param {class} message Discord.js message object.
     */
    async taSchedule(message) {
        try {
            let returnMessage = "";
            let hours = await LabHour.find();
            let current = [];
            for (let i = 0; i < hours.length; i++) {
                let start = new Date(hours[i].start);
                let end = new Date(hours[i].end);
                if (isPast(end)) {
                    start = await add(start, { weeks: 1 });
                    end = await add(end, { weeks: 1 });
                    await LabHour.updateOne({
                        _id: hours[i]._id,
                    }, {
                        $set: {
                            start: start,
                            end: end,
                            canceled: false,
                        }
                    });
                }
                if (isPast(start) && isFuture(end)) {
                    current.push(hours[i]);
                }
            }
            let oneWorking = false;
            for (let i = 0; i < current.length; i++) {
                if (!current[i].canceled) {
                    oneWorking = true;
                    returnMessage += "**" + current[i].ta + "** is currently working.\n";
                } else {
                    returnMessage += "**" + current[i].ta + "** canceled their current hours.\n";
                }
            }
            if (!current.length) {
                returnMessage += "No TA's scheduled for this hour.\n";
            }
            if (!oneWorking) {
                hours = await LabHour.find();
                let next = [];
                let distance = 0;
                let now = new Date();
                for (let i = 0; i < hours.length; i++) {
                    let diff = hours[i].start - now.getTime();
                    if (diff == distance && !hours[i].canceled) {
                        next.push(hours[i]);
                    }
                    if ((diff < distance || !next.length) && !hours[i].canceled) {
                        next = [hours[i]];
                        distance = diff;
                    }
                }
                for (let i = 0; i < next.length; i++) {
                    let start = new Date(next[i].start);
                    returnMessage += "\nNext Available TA: **" + next[i].ta + "** " + formatDistanceToNow(start, { addSuffix: true });
                }
            }
            const embed = new Discord.MessageEmbed()
            .setTitle('TA Availability')
            .setColor(0x25faf6)
            .setDescription(returnMessage);
            message.reply(embed);
        } catch (error) {
            const embed = new Discord.MessageEmbed()
            .setTitle('Bot Encountered an Error')
            .setColor(0x25faf6)
            message.reply(embed);
        }
    }
}

// Export
module.exports = TaBot;