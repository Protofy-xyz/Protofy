import {app} from '../lib/app';

app.get('/api/v1/test', async (req, res) => {
    res.send('hello test');
});