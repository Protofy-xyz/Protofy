import {app} from '../lib/app';
import { connectDB, getDB, response } from 'protolib/api';
import { getInitialData } from '../initialData';

const dbPath = '../../data/databases/db'
connectDB(dbPath, getInitialData) //preconnect database

app.get('/api/v1/notes', async (req, res) => {
    response(getDB(dbPath).get('notes'), res)
});