import {app} from '../lib/app';
import { response } from '../lib/response';

app.get('/api/v1/test', async (req, res) => {
    res.send('hello test');
});