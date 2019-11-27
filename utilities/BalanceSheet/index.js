import { NativeModules } from 'react-native';

const Matrix = require('../Matrix').Matrix;

const ERR = 0;


export default class BalanceSheet {

    constructor(batchName) {
        // this state is used to ensure when the methods are running the NativeModules methods which are asychronous have finished executing
        this.state = {
            eggs: false,
            feeds: false
        };
        this.context = batchName;

        this.eggs = JSON.parse(NativeModules.FileManager.fetchForCheck(batchName, "eggs"));
        this.feeds = JSON.parse(NativeModules.FileManager.fetchForCheck(batchName, "feeds"));
        this.state.eggs = true;
        this.state.feeds = true;
        NativeModules.FileManager.fetchBrief(batchName, (data) => {
            this.batchInformation = JSON.parse(data);
            this.context = batchName;
        });
    }

    eggPercentage() {
        // get eggs in stock
        let eggs;
        let percentage = 0;
        if(this.eggs) {
            eggs = this.eggs[(this.eggs.length - 1)][0];
            if(eggs) {
                percentage = Math.round(eggs/this.batchInformation.population[0].population);
            }
        }

        return percentage;
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
    balanceFeeds() {
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

    static balanceEggs() {
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

    static eggPriceCalculator(pU) {
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