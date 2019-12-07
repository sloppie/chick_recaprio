import { NativeModules } from 'react-native';

export let orderFinder = () => {
    let batchName = NativeModules.Sessions.getCurrentSession();
    let brief = JSON.parse(NativeModules.FileManager.fetchBriefSync(batchName));
    let { length } = brief.population;
    let order = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]

    let newOrder = [];

    let initialDate = new Date(brief.population[(length - 1)].date).getDay();

    for(let i=initialDate; i<7; i++) {
        newOrder.push(order[i]);
    }

    for(let i=0; i<(initialDate); i++) {
        newOrder.push(order[i]);
    }

    return newOrder;
}