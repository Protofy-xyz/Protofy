export const CardsAPI = (app, context) => {
    app.get('/api/core/v1/cards', async (req, res) => {
        const cards = await context.state.getStateTree({ chunk: 'cards' });
        res.send(cards);
    });

    app.post('/api/core/v1/cards/:group/:tag', async (req, res) => {
        const info = req.body;
        context.cards.addCard({
            group: req.params.group,
            tag: req.params.tag,
            name: info.name,
            description: info.description,
            card: info.card,
            emitEvent: true
        });
    });
}