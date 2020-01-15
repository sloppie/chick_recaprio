import { NativeModules } from 'react-native';
import FileManager from '../FileManager';


export default class DATE {

    static get months() {
        let isLeap = new Date().getFullYear()%4 === 0? 29: 28;
        let months = [
            ["Jan", 31],
            ["Feb", isLeap],
            ["Mar", 31],
            ["Apr", 30],
            ["May", 31],
            ["Jun", 30],
            ["Jul", 31],
            ["Aug", 31],
            ["Sep", 30],
            ["Oct", 31],
            ["Nov", 30],
            ["Dec", 31]
        ];

        return months;
    }

    static get days() {
        let days = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thur",
            "Fri",
            "Sat"
        ];

        return days;
    }

    // Methods
    static parse(timeString) {
        let dateObj = {};
        let days = /mon|tue|wed|thur|fri|sat|sun/gi;
        let timezone = /GMT\W\d{4}\s\W\w{3}\W/gi;
        // let months = /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/gi;
        let time = /\d{2}:\d{2}:\d{2}/gi
        let date = /jan\s\d{2}\s\d{4}|feb\s\d{2}\s\d{4}|mar\s\d{2}\s\d{4}|apr\s\d{2}\s\d{4}|may\s\d{2}\s\d{4}|jun\s\d{2}\s\d{4}|jul\s\d{2}\s\d{4}|aug\s\d{2}\s\d{4}|sep\s\d{2}\s\d{4}|oct\s\d{2}\s\d{4}|nov\s\d{2}\s\d{4}|dec\s\d{2}\s\d{4}/gi;

        dateObj.day = timeString.replace(date, "").replace(time, "").replace(timezone, "").trim();
        dateObj.time = timeString.replace(days, "")
            .replace(date, "")
            .replace(timezone, "")
            .trim();
        dateObj.date = timeString.replace(days, "")
            .replace(time, "")
            .replace(timezone, "")
            .trim();
        let splitDate = dateObj.date.split(" ");
        dateObj.dayNumber = splitDate[1];
        dateObj.month = splitDate[0];
        dateObj.year = splitDate[2];
        
        return dateObj;
    }

    // 'Mon Dec 23 2019 16:01:40 GMT+0300 (EAT)'
    static stringify(offset = null) {
        let todaysDate = new Date();
        let day = todaysDate.getDay();
        let date = todaysDate.getDate();
        let month = todaysDate.getMonth();
        let year = todaysDate.getFullYear();

        for (let i = 0; i < offset; i++) {
            if (date > 1) {
                date--;
            } else {
                if(month != 0) {
                    month--;
                    date = DATE.months[month][1];
                } else {
                    month = 11;
                    date = DATE.months[month][1];
                    year--;
                }
            }

            if (day > 0) {
                day--;
            } else {
                day = 7;
                day--;
            }
        }

        return `${DATE.days[day]} ${DATE.months[month][0]} ${DATE.normaliseDate(date)} ${year}`;
    }

    static getDate() {
        let name = NativeModules.Sessions.getCurrentSession();
        let batchInformation = JSON.parse(NativeModules.FileManager.fetchBriefSync(name))
        let batchData = JSON.parse(NativeModules.FileManager.fetchDataSync(name, "eggs"));
        let { length } = batchData;
        let offset;
        let suppossedSize;
        let inputSize;
        if(length > 0) { // ensure operation is not carried out on a new batch
            let weeks = new FileManager(batchInformation).calculateWeek();
            if(weeks[1]) {
                inputSize = batchData[weeks[0]]? batchData[weeks[0]].length: 0;
            } else {
                inputSize = batchData[weeks[0] - 1].length;
            }

            if(weeks[1]) {
                let previousWeek = batchData[weeks[0] - 1].length;
                if(previousWeek == 7) {
                    suppossedSize = weeks[1];
                } else {
                    suppossedSize = weeks[1] + (7 - previousWeek);
                }
            } else {
                suppossedSize = 7;
            }
            offset = suppossedSize - inputSize - 1;
            console.log(`offset: ${offset}\nsuppossedSize: ${suppossedSize}\ninputSize: ${inputSize}`)

            return DATE.stringify(offset);
        } else {
            return new Date().toDateString();
        }
    }

    /**
     * Compares the two dates and returns `true` if the first date is sooner than the second date
     * else, it returns `false`
     * 
     * @param { string } firstDate first time string
     * @param { string } secondDate second time string
     * 
     * @returns `true` if the first date is sooner than the second parameter (or if they are equal), else `false`
     */
    static isSooner(firstDate, secondDate) {
        let monthValues = {
            "Jan": 1,
            "Feb": 2,
            "Mar": 3,
            "Apr": 4,
            "May": 5,
            "Jun": 6,
            "Jul": 7,
            "Aug": 8,
            "Sep": 9,
            "Oct": 10,
            "Nov": 11,
            "Dec": 12
        };

        let firstDateObj = DATE.parse(firstDate);
        let secondDateObj = DATE.parse(secondDate);

        let answer = (
            (Number(firstDateObj.year) >= Number(secondDateObj.year)) &&
            (monthValues[firstDateObj.month] >= monthValues[secondDateObj.month]) &&
            (Number(firstDateObj.dayNumber) >= Number(secondDateObj.dayNumber))
        );

        return answer;
    }

    static toString(date, time = null) {
        let splitDate = date.split("/");
        let monthNumber = Number(splitDate[1]) - 1;
        let month = DATE.months[monthNumber][0];
        let dater = Number(splitDate[0]);
        let year = Number(splitDate[2])
        let formattedDate = `${month} ${DATE.normaliseDate(dater)} ${year}`;
        if(!time)
            formattedDate += " 08:00:00";
        else
            formattedDate += " " + time + ":00"

        return formattedDate;
    }

    static normaliseDate(number) {
        if(number<10) 
            return `0${number}`;
        else
            return `${number}`;
    }

    static getDifference(date1) {
        // initial Date
        let initDate = date1.split("/");
        let initialYear = Number(initDate[2]);
        let initialMonth = Number(initDate[1]) - 1;
        let initialDate = Number(initDate[0]);
        // current
        let currentDateObj = new Date();
        let currentDate = currentDateObj.getDate();
        let currentMonth = currentDateObj.getMonth();
        let currentYear = currentDateObj.getFullYear();
        let offset = 0;
        let weekNumber = 0;
        for(let y=initialYear; y<=currentYear; y++) {
            let initialMonths = (y == initialYear)? initialMonth: 0;
            let lastMonth = (y == currentYear)? currentMonth: 11;
            for(let m=initialMonths; m<=lastMonth; m++) {
                let days = (((y == currentYear && m==currentMonth))? currentDate: DATE.months[m][1]);
                let initial = (y== initialYear && m==initialMonth)? initialDate: 1;
                for(let d=initial; d<=days; d++) {
                    offset++;

                    if(!(offset % 7)){
                        weekNumber++;
                    }
                } // days loop
            } //month loop
        } //year loop

        return offset;
    }

    static getNumeralDate(date) {
        let splitDate = date.split(" ");
        let month;
        let dayNumber = splitDate[1];
        let year = splitDate[2];
        let time = splitDate[3];
        let newTime = splitDate[3].split(":");
        newTime[0] = `${DATE.normaliseDate((Number(newTime[0]) - 3))}`;
        newTime = newTime.join(":");
        time = newTime;
        let timezone = splitDate[4];

        for(let i=0; i<DATE.months.length; i++) {
            if(splitDate[0] == DATE.months[i][0]) {
                month = i+1;
                break;
            }
        }

        let newDate = `${year}-${DATE.normaliseDate(month)}-${dayNumber} ${time}`;

        return newDate;
    }
}
