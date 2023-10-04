import {app} from 'protolib/api';

app.get('/api/v1/test', async (req, res) => {
    res.send('hello test');
});