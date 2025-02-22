import { NativeModules } from 'react-native';
import InventoryManager from '../InventoryManager/index.js';

import { Matrix } from '../Matrix';

/**
 * This class helps link the FileManager NativeModule to the react-native app
 */
export default class FileManager {

    constructor(batchInformation) {
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
    calculateWeek() {
        let day = this.dateObj.getDay();
        let currentDay = this.initialDay;
        let offset = 0;
        let weekNumber = 0;
        for(let y=this.initialYear; y<=this.currentYear; y++) {
            let initialMonths = (y == this.initialYear)?this.initialMonth: 0;
            let lastMonth = (y == this.currentYear)? this.currentMonth: 11;
            for(let m=initialMonths; m<=lastMonth; m++) {
                let days = (((y == this.currentYear && m==this.currentMonth))? this.currentDate: this.months[m][1]);
                let initial = (y== this.initialYear && m==this.initialMonth)? this.initialDate: 1;
                for(let d=initial; d<=days; d++) {
                    offset++;

                    if(!(offset % 7)){
                        weekNumber++;
                    }
                } // days loop
            } //month loop
        } //year loop

        return [Math.floor(offset/7), offset%7];
    }

    static choices = {
        "casualties": "casualties",
        "eggs": "eggs",
        "feeds": "feeds"
    };

    static get CASUALTIES() {
        return "casualties";
    }

    static get EGGS() {
        return "eggs";
    }

    static get FEEDS() {
        return "feeds";
    }

    /**
     * 
     * @param {Object} batchInformation is the informatio pertaining to the relevant batch
     * @param {Object} data is the data to be added to the feeds store
     * 
     * data received is in the form below: (the data is stringified)
     * ```js
     *  {
     *      normalEggs: Number,
     *      smallerEggs: Number,
     *      largerEggs: Number,
     *      brokenEggs: Number
     *  }
     * ```
     * the data added to the pre-existing matrix is in the form: 
     * ```js
     *  [normalEggs, brokenEggs, smallerEggs, largerEggs, sum] 
     * ```
     */
    static addEggs(batchInformation, data, todaysCollect=null) {
        const key = FileManager.choices.eggs;
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        // let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        let parsedData = JSON.parse(data);
        let previousData;
        let newDay;
        let recordCheck = FileManager.checkForRecords(batchInformation, "eggs");
        NativeModules.FileManager.fetchData(batch.context, "eggs", (oldData) => {
            let {normalEggs, smallerEggs, largerEggs, brokenEggs} = parsedData;
				// !TODO use a try-catch block to account for first time data insert
                // !TODO make sure there is a null for ech empty week before the egggs starrt getting inserted
            try{
                previousData = JSON.parse(oldData);
                newDay = [normalEggs, brokenEggs, smallerEggs, largerEggs];
                let sum = newDay[0] + newDay[1] + newDay[2] + newDay[3];
                newDay.push(sum);
    
                if(weekInfo[1]) {
                    let cd = (weekInfo[1] - 1);
                    let previousWeekLength = previousData[weekInfo[0] - 1].length;
                    if(previousWeekLength == 7) {
                    // adds to the current day offset to the newly incomplete week
                        if (previousData[weekInfo[0]] instanceof Array) {
                            if (recordCheck) {
                                previousData[weekInfo[0]][0] = newDay;
                            } else {
                                previousData[weekInfo[0]].unshift(newDay);
                            }
                        } else {
                            previousData[weekInfo[0]] = [newDay];
                        }
                    } else {
                        previousData[weekInfo[0] - 1].unshift(newDay);
                    }
                } else {
                    let pi = (weekInfo[0] - 1);
                    // adds to the last day of the unfinished week
                    previousData[pi].unshift(newDay);
                }
            } catch (err) {
                // if a JSON parse error is caught it is to mean that the file is empty hence need to initialise it properly
                previousData = [];
                for(let i=0; i<=weekInfo[0]; i++) {
                    previousData.push(null);
                }

                newDay = [normalEggs, brokenEggs, smallerEggs, largerEggs]
                let sum = newDay[0] + newDay[1] + newDay[2] + newDay[3];
                newDay.push(sum);

                if(weekInfo[1]) {
                    let week = [];
                    for(let i=0; i<weekInfo[1]; i++) {
                        week.push(null);
                    }
                    week[0] = newDay;
                    previousData[weekInfo[0]] = week;
                } else {
                    let week = [];
                    let day = weekInfo[0] - 1;
                    for(let i=0; i<7; i++) {
                        week.push(null);
                    }
                    week[0] = newDay;
                    previousData[day] = week;
                }
            }

            NativeModules.FileManager.addData(batch.context, "eggs", JSON.stringify(previousData));
            InventoryManager.addEggs(newDay, todaysCollect);
            if(NativeModules.FileManager.listViewExists(batch.context, "eggs")) {
                NativeModules.FileManager.updateList(batch.context, "eggs", eggsToList(previousData));
            } else {
                NativeModules.FileManager.createListView(batch.context, "eggs", eggsToList(previousData));
            }
        });

    }

    /**
     * 
     * @param {Object} batchInformation is the informatio pertaining to the relevant batch
     * @param {Object} data is the data to be added to the feeds store
     * 
     * data received is in the form below: (the data is stringified)
     * ```js
     *  {
     *      date: Date,
     *      number: Number
     *  }
     * ```
     * the resultant stored matrix is in the form:
     * ```js 
     * [ date:Date, number:number, price:number, type:string]
     * ```
     */
    static addFeeds(batchInformation, data) { 
        const key = FileManager.choices.feeds;
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        let {date, number, type} = JSON.parse(data);
        type = InventoryManager.normaliseFeedsName(type);
        let price = JSON.parse(NativeModules.InventoryManager.fetchFeeds(type)).price;
        let previousData;
        let newData = [date, number, price, type];

        NativeModules.FileManager.fetchData(batch.context, "feeds", (oldData) => {
            if(oldData) {
                previousData = JSON.parse(oldData);
                if(weekInfo[1]) {
                    if(previousData[weekInfo[0]] instanceof Array) {
                        if(FileManager.checkForRecords(batchInformation, "feeds")){
                            let len = previousData[weekInfo[0]].length - 1;
                            previousData[weekInfo[0]][0] = newData
                        } else {
                            previousData[weekInfo[0]].unshift(newData);
                        }
                    } else {
                        previousData[weekInfo[0]] = [];
                        previousData[weekInfo[0]].push(newData);
                    }
                } else {
                    let pi = (weekInfo[0] - 1);
                    if(previousData[pi] instanceof Array) {
                        if(FileManager.checkForRecords(batchInformation, "feeds")) {
                            // let len = previousData[pi].length - 1;

                            // data from the previous entry is fetched to redo the inventory section
                            // fetch feeds used from batchInformation on feeds
                            let feedsInQuestion = previousData[pi][0];
                            // feed type fotm the feeds used
                            let feedsInType = feedsInQuestion[3];
                            // data is replaced at first position for the batch
                            previousData[pi][0] = newData;
                            
// ****************************** restocking feeds: *********************************************************************
                            // previous feedsInInventory
                            let previouslyStocked = JSON.parse(NativeModules.InventoryManager.fetchFeeds(feedsInType));
                            previouslyStocked.number[0].number += feedsInQuestion[1];
                            let newNumber = previouslyStocked.number[0].number;
                            // previousCurrentInventory
                            let previousCurrInv = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
                            previousCurrInv[1][feedsInType].number = newNumber;

                            // rewrite the CurrentInventory and FeedStock
                            NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(previousCurrInv));
                            NativeModules.InventoryManager.addFeeds(feedsInType, JSON.stringify(previouslyStocked));
                        } else {
                            previousData[pi].unshift(newData);
                        }
                    } else {
                        previousData[pi] = [];
                        previousData[pi].push(newData);
                    }
                }
            } else {
                previousData = [[]];
                previousData[0].push(newData);
            }

            NativeModules.FileManager.addData(batch.context, "feeds", JSON.stringify(previousData));
            InventoryManager.restockFeeds(JSON.parse(data));
            if(NativeModules.FileManager.listViewExists(batch.context, "feeds")) {
                NativeModules.FileManager.updateList(batch.context, "feeds", feedsToList(previousData));
            } else {
                NativeModules.FileManager.createListView(batch.context, "feeds", feedsToList(previousData));
            }
        });

    }

    /**
     * 
     * @param {Object} batchInformation is the informatio pertaining to the relevant batch
     * @param {Object} data is the data to be added to the feeds store
     * 
     * data received is in the form below: (the data is stringified)
     * ```js
     *  {
     *      date: Date,
     *      number: Number,
     *      description: String
     *  }
     * ```
     * The new data to be added to the matrix is in the form:
     * ```js
     *  {
     *      date:String, 
     *      number:Number, 
     *      description:String
     *  }
     * ```
     */
    static addCasualties(batchInformation, data) {
        const key = FileManager.choices.casualties;
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        let parsedData = JSON.parse(data);
        let { date, number, description } = parsedData;
        let previousData;
        let newData = {
            date, 
            number, 
            description
        };
        let exists = FileManager.checkForRecords(batchInformation, "casualties");
        console.log("Code got past exists")
        let today = new Date().toDateString();

        NativeModules.FileManager.fetchData(batch.context, "casualties", (oldData) => {
            if (oldData) {
                previousData = JSON.parse(oldData);
                if(exists) {
                    previousData[today].unshift(newData);                    
                } else {
                    previousData[today] = [newData];
                }
            } else {
                previousData = {};
                previousData[today] = [newData];
            }

            let brief = JSON.parse(NativeModules.FileManager.fetchBriefSync(batch.context));
            let { population } = brief.population[0];
            let newPopulation = {
                date: new Date().toDateString(),
                population: (population - number),
            };
            // console.log(JSON.stringify(previousData, null, 2))
            brief.population.unshift(newPopulation);
            // JSON.stringify(brief, null, 2);

            NativeModules.FileManager.addData(batch.context, "casualties", JSON.stringify(previousData));
            NativeModules.FileManager.writeBrief(batch.context, JSON.stringify(brief));
        });
    }

    static checkForRecords(batchInformation, type) {
        let batch = new FileManager(batchInformation);
        let weeks = batch.calculateWeek();
        let exists = false;

        try {
            if (weeks[1]) {
                let data = NativeModules.FileManager.fetchDataSync(batch.context, type);
                // console.log(`This is the data according to FFC: ${JSON.stringify(data, null, 2)}`)
                let oldData = JSON.parse(data);
                let week = weeks[0];
                let day = weeks[1] - 1; 
                if (type == "eggs") {
                    exists = oldData[week].length == weeks[1];
                } else if(type == "feeds"){
                    let lastWeek = oldData[week];
                    let today = new Date().toDateString();
                    let i = lastWeek.length - 1;
                    let interrim = lastWeek[0][0];
                    exists = today == interrim;
                } else {
                    let today = new Date().toDateString();
                    exists = (oldData[today] !== undefined);
                }
                return exists;
            } else {
                let data = NativeModules.FileManager.fetchForCheck(batch.context, type);
                let oldData = JSON.parse(data);
                let week = weeks[0] - 1;
                let day = 6;
                if (type == "eggs") {
                    exists = oldData[week].length == 7;
                } else if(type == "feeds"){
                    let lastWeek = oldData[week];
                    let today = new Date().toDateString();
                    let i = lastWeek.length - 1;
                    let interrim = lastWeek[0][0];
                    exists = (interrim == today);
                } else {
                    let today = new Date().toDateString();
                    exists = (data[today] !== undefined);
                    console.log(`This is the state of existence: ${exists}`)
                }
            }
        } catch (err) {
            // pass
        }

        console.log(exists);

        return exists;
    }

    static batchExists(name) {
        return NativeModules.FileManager.batchExists(name);
    }

    static write() {
        NativeModules.FileManager.create(brief.name, JSON.stringify(brief), (success, err) => {
            if(success) {
                NativeModules.FileManager.addData(brief.name, "feeds", JSON.stringify(feeds));
                NativeModules.FileManager.addData(brief.name, "eggs", JSON.stringify(eggs));
                NativeModules.FileManager.addData(brief.name, "casualties", JSON.stringify(casualties));
                NativeModules.FileManager.createListView(brief.name, "eggs", eggsToList(eggs));
                NativeModules.FileManager.createListView(brief.name, "feeds", feedsToList(feeds));
            }
        });
    }

    static resetCurrentInventory() {
        let batchNames = NativeModules.FileManager.fetchBatchNames().split(",");
        batchNames.pop();

        let eggInventory = [];

        batchNames.forEach(batch => {
            let eggData = JSON.parse(NativeModules.FileManager.fetchDataSync(batch, "eggs"))
            let { length } = eggData;
            let todaysEggs = eggData[(length - 1)][0];
            eggInventory.push(todaysEggs);
        });

        let eggMatrix = new Matrix(eggInventory[0]);

        for(let i=1; i<eggInventory.length; i++) {
            eggMatrix.add(new Matrix(eggInventory[i]));
        }

        let currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
        currentInventory[0] = eggMatrix.matrix;

        NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
    }

} 

function eggsToList(data) {    
    let eggList = [];
    
    for(let i=0; i<data.length; i++) {
        if (data[i]) {
            let week = {
                key: i.toString(),
                weekNumber: (i + 1),
                eggs: data[i]
            };
            eggList.unshift(week);
        }
    }

    let answer = JSON.stringify(eggList);
    return answer;
}

function feedsToList(data) {
    let feedsList = [];
    for (let i = 0; i < data.length; i++) {
        let week = {
            key: i.toString(),
            weekNumber: (i + 1),
            week: data[i],
        };
        feedsList.unshift(week);
    }

    let answer = JSON.stringify(feedsList);
    return answer;
}
