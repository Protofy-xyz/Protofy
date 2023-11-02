import { EventModel } from ".";
import {CreateApi} from '../../../api'

export const EventsAPI = CreateApi('events', EventModel, __dirname, '/adminapi/v1/', 'events', {}, undefined, undefined, undefined, false, {disableEvents: true})
