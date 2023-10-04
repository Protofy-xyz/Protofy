import { connectDB, getDB, response, app } from 'protolib/api';
import { getInitialData } from 'common';

const dbPath = '../../data/databases/db'
connectDB(dbPath, getInitialData) //preconnect database

app.get('/api/v1/notes', async (req, res) => {
    response(getDB(dbPath).get('notes'), res)
});