import {CronJob, CronJobParams} from 'cron'

  
export function createCronJob(cronExpression: string, callb: any) {
    return new CronJob(
        cronExpression, // cronTime
        callb, // onTick
        null, // onComplete
        true, // start
    );
}
