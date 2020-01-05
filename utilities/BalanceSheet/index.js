import { NativeModules } from 'react-native';

const Matrix = require('../Matrix').Matrix;

const ERR = 0;


export default class BalanceSheet {

    constructor(batchName) {
        // this state is used to ensure when the methods are running the NativeModules
        // methods which are asychronous have finished executing
        this.state = {
            eggs: false,
            feeds: false
        };
        this.context = batchName;

        try {
            this.eggs = JSON.parse(NativeModules.FileManager.fetchForCheck(batchName, "eggs"));
            this.feeds = JSON.parse(NativeModules.FileManager.fetchForCheck(batchName, "feeds"));
            this.state.eggs = true;
            this.state.feeds = true;
        } catch {
            this.eggs = null;
            this.state.feeds = null;
            this.state.eggs = null;
            this.feeds = null;
        }
        this.batchInformation = JSON.parse(NativeModules.FileManager.fetchBriefSync(batchName));
    }

    /**
     * Returns the percentage of chicken that are laying eggs based on the last egg-entrance
     * divided by the total population of the batch at the time
     * 
     * @returns the percentage of the chicken laying eggs rounded to the nearest real number
     */
    eggPercentage():Number {
        // get eggs in stock
        let eggs = 0;
        let percentage = 0;
        if(this.eggs && this.batchInformation) {
            eggs = this.eggs[(this.eggs.length - 1)][0][4];
            if(eggs) {
                percentage = Math.round(eggs/(this.batchInformation.population[0].population) * 100);
            }
        }

        return percentage;
    }

    /**
     * This function gets the initial date from the batch held in the class
     * 
     * @returns the date when the batch was bought
     */
    getInitialDate() {
        if (this.batchInformation) {
            let { population } = this.batchInformation;
            let { length } = population;

            let date = new Date(population[(length - 1)].date);

            return date.toDateString();
        } else {
            return "";
        }
    }

    /**
     * This method tries to get the total sum of cost of feeds on a specific batch. This is enabled by
     * the fact that the array for each day feeds stored is in the form
     *  ```js 
     * [date, number, price]
     * ```
     * 
     * @returns total sum of costs from the first week
     */
    balanceFeeds():Number {
        let totalSum = 0;
        if (this.state.feeds) {
            this.feeds.forEach((weeks) => {
                weeks.forEach(day => {
                    let totalCost = (day[2]) ? (day[1] * day[2]) : (day[1] * 2100); // numberUsed * priceOfUsedFeeds
                    totalSum += totalCost;
                });
            });
        }

        return totalSum;
    }

    /**
     * this function gets the total amount grossed by the eggs sold over the pick up period specified
     * 
     * @returns the total sum of eggs in the inventory pickUp data based on the calculated prices
     */
    static balanceEggs():Number {
        let totalSum = 0;
        let pickUp;
        try {
            pickUp = NativeModules.InventoryManager.fetchPickUp();
            pickUp = JSON.parse(pickUp)
        } catch(err) {
            pickUp = [];
        }
        for(let i=0; i<pickUp.length; i++) {
            totalSum += BalanceSheet.eggPriceCalculator(pickUp[i]);
        }

        return totalSum;
    } 

    /**
     * this function calculates the total amount grossed by eggs picked up in a specific pick up object
     * 
     * @param { Object } pU object containing pick up data such as: `date`, `eggs` and `prices`
     * 
     * @returns the total amount grossed by the eggs sold in the pick up object specified
     */
    static eggPriceCalculator(pU):Number {
        let pickUp = pU;
        let sum = 0;
        if(pickUp.price) {
            for(let i in pickUp.number) {
                // this is because the number is stored in a string of `30.4` <- e.g
                let fullTrays = Number(pickUp.number[i].split(".")[0]);
                let trayPrice = pickUp.price[i];
                sum += (fullTrays * trayPrice);
            }
        }

        return sum;
    }

}
