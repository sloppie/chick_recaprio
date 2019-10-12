const eggs = require('./data/eggs.json');
const feeds = require('./data/feeds.json');


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
    eggList = JSON.stringify(eggList);
    return eggList;
}

function feedsToList(data) {
    let feedsList = [];
    for (let i = 0; i < data.length; i++) {
        let week = {
            key: i.toString(),
            weekNumber: (i + 1),
            week: data[i]
        };
        feedsList.unshift(week);
    }
    feedsList = JSON.stringify(feedsList);
    return feedsList;
}

console.log(feedsToList(feeds));
