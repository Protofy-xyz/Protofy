import {getLogger } from 'protobase';

// fix: when callback y the last argument doesn't disconnects from
// the scheduleMask and converts into an anonym func
export const createSchedule = (time,  callb, day, month, year) => {    
    const logger = getLogger()
    let date = createDateObject(time, day, month, year); 
    if (!date.getTime()) {
        logger.info("Date error: Cannot execute Scheduled function"); 
    } else {
        console.log('date: ', date)
        let targetTime = date.getTime() - Date.now(); 
        logger.info("Will be executed in: "+Math.round(targetTime/1000).toFixed(1)+" seconds")
        setTimeout(() => {
            callb()
            logger.info("scheduled callback executed")
        }, targetTime) 
    }
}


 //1 marzo 2023
function createDateObject(time, day, monthName, year): Date {
    const monthMap = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11
    };
  
    const [hour, minute] = time.split(':').map(num => parseInt(num, 10));
    const monthIndex = monthMap[monthName.toString()];
    if (monthIndex === undefined) {
        console.log({
            time, day, monthName, year
        }, monthMap[monthName.toString()])
        return null
    }
  
    return new Date(year, monthIndex, day, hour, minute);
}
