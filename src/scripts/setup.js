const mongoose = require("mongoose");
var add = require('date-fns/add');
var startOfHour = require('date-fns/startOfHour')
var setHours = require('date-fns/setHours')

mongoose.connect('mongodb://localhost:27017/tabot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let TA = require('./ta');
let LabHour = require('./labhour');

let setup = async function() {
    let TAs = [
        {
            name: "Andrew",
            hours: [
                {start: {day: 2, hour: 10}, end: {day: 2, hour: 11}},
                {start: {day: 3, hour: 12}, end: {day: 3, hour: 14}},
                {start: {day: 4, hour: 10}, end: {day: 4, hour: 12}},
            ]
        },
        {
            name: "Luke",
            hours: [
                {start: {day: 1, hour: 8}, end: {day: 1, hour: 11}},
                {start: {day: 3, hour: 8}, end: {day: 3, hour: 12}},
                {start: {day: 4, hour: 8}, end: {day: 4, hour: 10}},
                {start: {day: 5, hour: 8}, end: {day: 5, hour: 10}},
            ]
        },
        {
            name: "Connor",
            hours: [
                {start: {day: 1, hour: 9}, end: {day: 1, hour: 11}},
                {start: {day: 1, hour: 12}, end: {day: 1, hour: 14}},
                {start: {day: 3, hour: 9}, end: {day: 3, hour: 14}},
            ]
        },
        {
            name: "Casey",
            hours: [
                {start: {day: 1, hour: 15}, end: {day: 1, hour: 17}},
                {start: {day: 3, hour: 15}, end: {day: 3, hour: 17}},
                {start: {day: 6, hour: 10}, end: {day: 6, hour: 13}},
            ]
        },
        {
            name: "Bethany",
            hours: [
                {start: {day: 2, hour: 18}, end: {day: 2, hour: 19}},
                {start: {day: 4, hour: 17}, end: {day: 4, hour: 19}},
                {start: {day: 5, hour: 15}, end: {day: 5, hour: 17}},
            ]
        },
        {
            name: "Katy",
            hours: [
                {start: {day: 2, hour: 8}, end: {day: 2, hour: 9}},
                {start: {day: 2, hour: 12}, end: {day: 2, hour: 13}},
                {start: {day: 4, hour: 11}, end: {day: 4, hour: 13}},
                {start: {day: 5, hour: 9}, end: {day: 5, hour: 11}},
            ]
        },
    ];
    for (let i = 0; i < TAs.length; i++) {
        for (let j = 0; j < TAs[i].hours.length; j++) {
            let hour = new LabHour({
                ta: TAs[i].name,
                start: (await getTime(TAs[i].hours[j].start.day, TAs[i].hours[j].start.hour)).getTime(),
                end: (await getTime(TAs[i].hours[j].end.day, TAs[i].hours[j].end.hour)).getTime(),
                canceled: false,
            });
            await hour.save();
        }
         
    }
}

function getTime(day, hour) {
    let now = new Date();
    let differenceToZero = 7 - now.getDay();
    if (differenceToZero == 7) differenceToZero = 0;
    let date = add(now, { days: differenceToZero + day, weeks: -1 });
    date = setHours(date, hour);
    date = startOfHour(date);
    date = add(date, {minutes: 360});
    return date;
}

setup();