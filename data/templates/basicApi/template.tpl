import {app} from '../lib/app';
import { response } from '../lib/response';

app.get('/api/v1/{{name}}', async (req, res) => {
    res.send('hello {{name}}');
});