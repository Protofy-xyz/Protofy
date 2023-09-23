import {app} from '../lib/app';
import { connectDB, getDB } from '../lib/db';
import { response } from '../lib/response';

const dbPath = '../../data/databases/db'
connectDB(dbPath) //preconnect database

app.get('/api/v1/notes', async (req, res) => {
    response(getDB(dbPath).get('notes'), res)
});