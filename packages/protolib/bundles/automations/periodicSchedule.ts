import {CronJob} from 'cron'
import {getLogger } from 'protolib/base';

export const createPeriodicSchedule = (hours, minutes, days, callb) => {    
    const logger = getLogger()
    const cronExpr = parseCronExpression(minutes, hours, days) 
    new CronJob(
        cronExpr, // cronTime
        async () => {
            await callb()
            logger.info('Executed periodic schedule'); 
        }, // onTick
        null, // onComplete
        true, // start
    );
    logger.info('Periodic schedule: '+hours+':'+minutes+' on '+days)
}

const parseCronExpression = (minutes, hours, days) => {
    console.log({
        hours, 
        minutes, 
        days
    })
    const daysHashmap = {
        "monday": 1, 
        "tuesday": 2, 
        "wednesday": 3, 
        "thursday": 4, 
        "friday": 5, 
        "saturday": 6, 
        "sunday": 7
    }
      
    let daysIndex = []
    days.split(',').forEach(item => {
        let day = item.trim()
        daysIndex.push(daysHashmap[day.toLowerCase()])
    })
      
    let cronExpr = '0 ' + minutes + ' ' + hours + ' * * ' + daysIndex.join(',')
    return cronExpr
}
