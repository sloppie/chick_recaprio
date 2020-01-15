import { NativeModules } from 'react-native';
import { Colors } from 'react-native-paper';
import DATE from '../Date';


export default class MortalityRate {

    constructor(batchName) {
        this.batchName = batchName;
        this.brief = JSON.parse(NativeModules.FileManager.fetchBriefSync(this.batchName));
        this.lx = this.brief.population[0].population;
        let { length } = this.brief.population;
        this.initialPopulation = this.brief.population[length - 1].date;
    }

    calculate(beginning) {
        this.lx0;
        this.lx0_date;

        for(let i=0; i<this.brief.population.length; i++) {
            let currentDate = this.brief.population[i].date;
            currentDate = new Date(currentDate).toDateString();
            if(DATE.isSooner(beginning, currentDate)) {
                this.lx0 = this.brief.population[i].population;
                this.lx0_date = currentDate;
                break;
            } else if(i == (this.brief.population.length - 1)) {
                this.lx0 = this.brief.population[i].population;
                this.lx0_date = currentDate;
            }
        }

        console.log("Current Population: " + this.lx)
        let usable = MortalityRate.reformatDate(this.lx0_date);
        console.log("Current Population: " + this.lx0);
        this.n = DATE.getDifference(usable);

        this.dx = this.lx - this.lx0;
        let px = (this.lx) /this.lx0;
        console.log(`this is px: ${px}`)

        return px;
    }

    static reformatDate(date) {
        let parsedDate = DATE.parse(date);
        let month;
        let dayNumber = Number(parsedDate.dayNumber);
        let year = Number(parsedDate.year);

        for(let i=0; i<12; i++) {
            if(parsedDate.month == DATE.months[i][0]) {
                month = i + 1;
                break;
            }
        }

        let formattedDate = `${DATE.normaliseDate(dayNumber)}/${DATE.normaliseDate(month)}/${year}`;

        return formattedDate;
    }
    
    casualtyManager() {
        let casualties = JSON.parse(NativeModules.FileManager.fetchDataSync(this.batchName, "casualties"));
        let barChartData = {
            labels: [],
            legend: ["Illness", "Crowding", "Canibalism", "Unknown"],
            data: [],
            barColors: [Colors.amber500, Colors.green500, Colors.blue500, Colors.red500],
        };
        let fourWeeks = this.getWeeks();
        let initialDate = new Date(this.initialPopulation).toDateString();

        for(let i=0; i<4; i++) {
            let deaths = {
                illness: 0,
                crowding: 0,
                canibalism: 0,
                unknown: 0
            };
            if(fourWeeks[i][0] != initialDate) {
                barChartData.labels.unshift(`W'${DATE.normaliseDate(i+1)}`);
            } else {
                barChartData.labels.unshift(`W${DATE.normaliseDate(i+1)}`);

                let daysCasualties = casualties[fourWeeks[i][0]];
                // console.log(`Days casualties: ${JSON.stringify(daysCasualties, null, 2)}`)
                if(daysCasualties != undefined) {
                    for(let c=0; c<daysCasualties.length; c++) {
                        let illnessReg = /illness/gi;
                        let crowdingReg = /crowding/gi
                        let canibalismReg = /canibalism/gi;
                        let unknownReg = /unknown/gi;
                        let casualtyDescription = daysCasualties[c].description;

                        if(illnessReg.test(casualtyDescription)) {
                            deaths.illness += daysCasualties[c].number;
                        } else if(crowdingReg.test(casualtyDescription)) {
                            deaths.crowding += daysCasualties[c].number;
                        } else if(canibalismReg.test(casualtyDescription)) {
                            deaths.canibalism += daysCasualties[c].number;
                        } else {
                            deaths.unknown += daysCasualties[c].number;
                        }
                    }
                    barChartData.data.push([deaths.illness, deaths.crowding, deaths.canibalism, deaths.unknown]);
                    return Promise.resolve(barChartData);
                }
            }

            for(let d=0; d<7; d++) {
                let date = fourWeeks[i][d];
                let daysCasualties = casualties[date];
                if(daysCasualties != undefined) {
                    for(let c=0; c<daysCasualties.length; c++) {
                        let illnessReg = /illness/gi;
                        let crowdingReg = /crowding/gi
                        let canibalismReg = /canibalism/gi;
                        let unknownReg = /unknown/gi;
                        let casualtyDescription = daysCasualties[c].description;

                        if(illnessReg.test(casualtyDescription)) {
                            deaths.illness += daysCasualties[c].number;
                        } else if(crowdingReg.test(casualtyDescription)) {
                            deaths.crowding += daysCasualties[c].number;
                        } else if(canibalismReg.test(casualtyDescription)) {
                            deaths.canibalism += daysCasualties[c].number;
                        } else {
                            deaths.unknown += daysCasualties[c].number;
                        }
                    }
                }
            }

            barChartData.data.push([deaths.illness, deaths.crowding, deaths.canibalism, deaths.unknown]);
        }


        return Promise.resolve(barChartData);
    }

    getWeeks() {
        let weeks = [];
        let length = -1;
        for(let i=1; i<29; i++) {
            let day = i - 1;
            let newWeek = ((i - 1) % 7 == 0);
            if(newWeek) {
                weeks.unshift([]);
                length++;
            }

            weeks[0].push(DATE.stringify(day))
        }

        return weeks;
    }

}
