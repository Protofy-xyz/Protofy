import { EventModel } from "./eventsModels";
import {CreateApi} from 'protolib/api'

export const EventsAPI = CreateApi('events', EventModel, __dirname, '/adminapi/v1/')
