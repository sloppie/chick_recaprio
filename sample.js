const fs = require("fs");
let dts = [];

class FileManager {
    constructor(batchInformation){
        this.batchInformation = batchInformation;
        this.context = this.batchInformation.name;
        let length = this.batchInformation.population.length - 1;
        // timestamp
        this.initialTimestamp = this.batchInformation.population[length].date;
        // initial Date Obj
        this.dateObj = new Date(this.initialTimestamp);
        this.initialDay = this.dateObj.getDay();
        this.initialYear = this.dateObj.getFullYear();
        this.initialDate = this.dateObj.getDate();
        this.initialMonth = this.dateObj.getMonth();
        
        this.days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];
        let current = new Date();
        this.months = [
            ["january", 31],
            ["february", (current.getFullYear() % 4) ? 28: 29],
            ["march", 31],
            ["april", 30],
            ["may", 31],
            ["june", 30],
            ["july", 31],
            ["august", 31],
            ["september", 30],
            ["october", 31],
            ["november", 30],
            ["december", 31]
        ];
        this.currentDate = current.getDate();
        this.currentDay = current.getDay();
        this.currentYear = current.getFullYear();
        this.currentMonth = current.getMonth();
    }

    /**
     * @returns Array holding the values of `CompleteNumberOfWeeks` and `NumberOfDaysPassedInTheIncompleteWeek`
     */
    calculateWeek(){
        let day = this.dateObj.getDay();
        let currentDay = this.initialDay;
        let offset = 0;
        let weekNumber = 0;
        for(let y=this.initialYear; y<=this.currentYear; y++){
            let initialMonths = (y == this.initialYear)?this.initialMonth: 0;
            let lastMonth = (y == this.currentYear)? this.currentMonth: 11;
            for(let m=initialMonths; m<=lastMonth; m++){
                // console.log("loop 2 i month: " + m + " which has: " + this.months[m][1] + " days");
                // d should account for initial month
                let days = (((y == this.currentYear && m==this.currentMonth))? this.currentDate: this.months[m][1]);
                let initial = (y== this.initialYear && m==this.initialMonth)? this.initialDate: 1;
                for(let d=initial; d<=days; d++){
                    // if(this.days[currentDay] == "sunday"){
                    //     currentDay = 0;
                    // }else{
                    //     currentDay++;
                    // }
                    offset++;

                    if(!(offset % 7)){
                        weekNumber++;
                    }
                    // adds dates
                    let dte = [m+1, d, y];
                    dts.push(dte)
                } // days loop
            } //month loop
        } //year loop

        console.log(`${weekNumber} weeks, ${offset}`);
        return [Math.floor(offset/7), offset%7];
    }

    static createTemplate(){
        return (
            {
                eggs: {},
                feeds: {},
                casualties: {},
            }
        );
    }
}

  /**
   * ```js
   *  {
   *    "name": "Patient Zero",
   *    "population": [
   *      {
   *        "population": 1200,
   *        "date": Number()
   *      }
   *    ]
   *  }
   * ```
   */

let batchInformation = {
    "name": "Batch II",
    "population": [
        {
            "population": 1500,
            "date": new Date("6/6/2018"),
        }
    ],
};

let initial = new FileManager(batchInformation);
let weeks = initial.calculateWeek();
let threshold = 16;
let days = [
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
    "monday",
    "tuesday"
];
console.log(days[initial.initialDay]);

let probability = (1 - 1300/1500);
console.log(`probability of death: ${probability}`)

let batchWeeks = [];
let newArray = [];
let feedsArr = [];
let casArr = [];

let checker = 0;
for(let i=1; i<=(weeks[0] + 1); i++) {
    let daysDate;
    let weeklyCas = [];
    let week = FileManager.createTemplate();
    if(i<threshold) {
        let fdArr = [];
        for(let d=0; d<7; d++){
            daysDate = `${dts[0][0]}/${dts[0][1]}/${dts[0][2]}`;
            if(!(checker & 1)){
                if(Math.random() <= probability) {
                    let number = Math.round(Math.random() * 5);
                    week.casualties[days[d]] = {date: daysDate, number, description: "Died mysteriously"}
                    population = {
                        date: daysDate,
                        population: (batchInformation.population[0].population - number)
                    };

                    weeklyCas.push([daysDate, number, "died mysteriously"]);

                    batchInformation.population.unshift(population);
                }

                let fn = (3 + Math.round(Math.random()));
                week.feeds[days[d]] = {
                    date: daysDate,
                    number: fn
                };
                
                fdArr.push([daysDate, fn]);

            }
            dts.shift();
            checker++;
        }

        newArray.push(null);
        feedsArr.push(fdArr);
    } else {
        let weekArray = [];
        let fdArr = [];
        for(let d=0; d<7; d++) {
            if (Math.random() <= probability) {
                let number = Math.round(Math.random() * 5);
                week.casualties[days[d]] = { date: daysDate, number, description: "Died mysteriously" }
                population = {
                    date: daysDate,
                    population: (batchInformation.population[0].population - number)
                };

                weeklyCas.push([daysDate, number, "died mysteriously"]);

                batchInformation.population.unshift(population);
            }
            daysDate = `${dts[0][0]}/${dts[0][1]}/${dts[0][2]}`;
            let eggs = {
                normalEggs: (1100 + Math.floor(Math.random() * 80)),
                brokenEggs: 34,
                smallerEggs: 56,
                largerEggs: 30
            }

            let dayArr = [
                eggs.normalEggs,
                eggs.brokenEggs,
                eggs.largerEggs,
                eggs.smallerEggs
            ];

            let ttl = 0;
            dayArr.forEach((data) => {
                ttl += data;
            });

            dayArr.push(ttl);
            weekArray.push(dayArr);

            if(!(checker & 1)) {
                let fn = (7 + Math.round(Math.random()));
                week.feeds[days[d]] = {
                    date: daysDate,
                    number: fn
                };
                fdArr.push([daysDate, fn]);
            }
            dts.shift();

            week.eggs[days[d]] = eggs;
            checker++;
            if(dts.length == 0) break;
        }

        casArr.push(weeklyCas);
        feedsArr.push(fdArr);
        newArray.push(weekArray);
    }
    
    // console.log(week);
    batchWeeks.push(week);
}

let batch2 = {
    batchInformation,
    batchWeeks
};

fs.mkdir('./data', (err) => {
    if(!err) {
        fs.writeFile('./data/brief.json', JSON.stringify(batchInformation), (err) => {
            if(err) {
                console.log('error writing to brief');
            }
        });
        fs.writeFile('./data/feeds.json', JSON.stringify(feedsArr), (err) => {
            if(!err) {
                console.log("data ready for use");
            }
        });
        fs.writeFile('./data/eggs.json', JSON.stringify(newArray), (err) => {
            if(!err) {
                console.log("data ready for use");
            }
        });
        fs.writeFile('./data/casualties.json', JSON.stringify(casArr), (err) => {
            if(!err) {
                console.log("data ready for use");
            }
        });
    }
});

let stringify = (number) => (number<10)? `0${number}`: `${number}`;
