import {CronJob, CronJobParams} from 'cron'

  
export function createCronJob(opts: CronJobParams) {
    return CronJob.from(opts)
}
