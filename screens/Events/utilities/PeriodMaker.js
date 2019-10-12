export default class PeriodMaker{
  constructor(){
    let timestamp = new Date().getTime();
  }
  static get CURRENT_YEAR (){
    return new Date().getFullYear();
  }
  static get CURRENT_MONTH  () {return new Date().getMonth()};
  static get CURRENT_DATE  () {return new Date().getDate()};

  static get MONTH_NAMES  () { return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]}

    static get MONTHS () { return [31, 
      ((new Date().getFullYear()% 4) == 0)? 29: 28, 
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ]};

  splitMonths(initialDate){
    if(/\d*\s*,\d*/gi.test(initialDate)){
      let date = initialDate.split(/ [a-z]*,\d*/gi).join("").trim();
      let month = initialDate.split(/\d*/gi).join("").split(/,\d*/gi).join("");
      let year = initialDate.split(/\d{1,} [a-z]{1,},/gi).join("");
      console.log(`This is the month and day respectively:${date} ${month}, ${year}`);
      PeriodMaker.CURRENT_YEAR - year;

      let years = [];

      for(let i=Number(year); i<=PeriodMaker.CURRENT_YEAR; i++){
        if(i!=PeriodMaker.CURRENT_YEAR){
          let dates = [];
          for(let m=PeriodMaker.MONTH_NAMES.indexOf(month); m<12; m++){
            let daysMonth = [PeriodMaker.MONTHS[m], PeriodMaker.MONTH_NAMES[m], i];
            dates.unshift(daysMonth);
            // console.log(daysMonth[0] + " " + daysMonth[1], i);
          }
          years.unshift(dates);
        }else{
          let dates = [];
          for(let m=0; m<=PeriodMaker.CURRENT_MONTH; m++){
            let daysMonth = [PeriodMaker.MONTHS[m], PeriodMaker.MONTH_NAMES[m], i];
            dates.unshift(daysMonth);
            // console.log(daysMonth[0] + " " + daysMonth[1], i);
          }
          years.unshift(dates);
        }

      }

      return years;
    }else{
      console.log("Failed");
    }
  }
}
