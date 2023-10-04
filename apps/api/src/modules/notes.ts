import { connectDB, getDB, response, app } from 'protolib/api';
import { getInitialData } from 'app/initialData';

const dbPath = '../../data/databases/db'
connectDB(dbPath, getInitialData(dbPath)) //preconnect database

app.get('/api/v1/notes', async (req, res) => {
    response(getDB(dbPath).get('notes'), res)
});