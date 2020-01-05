const FileManager = require('./../index').FileManager;

function batchInformation(date, correctTally) {
    return [
        {
            name: "Patient Zero",
            population: [
                {
                    population: 1000,
                    date: new Date(date).getTime()
                }
            ]
        },
        correctTally
    ]
}

let tests = [
    batchInformation("9/12/2019", 2),
    batchInformation("9/1/2019", 13),
    batchInformation("8/15/2019", 30),
    batchInformation("1/1/2019", 256),
    batchInformation("12/31/2018", 257)
];

// tests are invalid since the return type has changed
((testArr) => {
    for(let i=0; i<testArr.length; i++){
        let fm = new FileManager(testArr[i][0]);
        if(testArr[i][1] == fm.calculateWeek()){
            console.log(`Test ${i} passed`);
        }else {
            console.log(`Test ${i} FAILED!!!`)
        }
    }
})(tests);

