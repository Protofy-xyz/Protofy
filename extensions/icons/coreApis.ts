import fs from 'fs';

export default (app, context) => {
    app.get('/api/core/v1/icons', async (req, res, session) => {
        const icons = fs.readdirSync('../../data/public/icons').filter((icon) => icon.endsWith('.svg')).map((icon) => icon.replace('.svg', ''))
        res.send({ icons })
    })
}