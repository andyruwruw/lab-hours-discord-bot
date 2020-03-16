const mongoose = require("mongoose");

let TA = require('./ta');
let LabHour = require('./labhour');

let setup = function() {
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
        
    }

}

