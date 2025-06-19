export default (app, context) => {

    context.cards.add({
        group: 'board',
        tag: "sketch",
        id: 'sketch',
        templateName: "Sketch canvas",
        name: "board_sketch",
        defaults: {
            name: "",
            icon: "pencil",
            description: "Draw something",
            type: 'value',
            html: "return sketch(data)"
        },
        emitEvent: true
    });

}



