import { NativeModules } from 'react-native';
import DATE from '../Date';


export default class MortalityRate {

    constructor(batchName) {
        this.batchName = batchName;
        // this.casualties = JSON.parse(NativeModules.FileManager.fetchDataSync(this.batchName, "casualties"));
        this.brief = JSON.parse(NativeModules.FileManager.fetchBriefSync(this.batchName));
        this.lx = this.brief.population[0].population;
    }

    calculate(beginning) {
        this.lx0;
        this.lx0_date;

        for(let i=0; i<this.brief.population.length; i++) {
            let currentDate = this.brief.population[i].date;
            currentDate = new Date(currentDate).toDateString();
            if(!DATE.isSooner(currentDate, beginning)) {
                this.lx0 = this.brief.population[i].population;
                this.lx0_date = currentDate;
                break;
            } else if(i == this.brief.population.length) {
                this.lx0 = this.brief.population[i].population;
                this.lx0_date = currentDate;
            }
        }

        console.log("Current Population: " + this.lx)
        let usable = MortalityRate.reformatDate(this.lx0_date);
        this.n = DATE.getDifference(usable);

        this.dx = this.lx - this.lx0;
        let px = (this.lx) /this.lx0;

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

}
