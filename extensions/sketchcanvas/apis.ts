import {getServiceToken} from 'protonode'

export default (app, context) => {
    context.cards.add({
        group: 'board',
        tag: "sketch",
        id: 'board_sketch',
        templateName: "Sketch canvas",
        name: "canvas",
        defaults: {
            width: 3,
            height: 10,
            name: "sketch",
            freeze: true,
            icon: "pencil",
            description: "Draw something",
            type: 'value',
            html: "return sketch(data)"
        },
        token: getServiceToken(),
        emitEvent: true
    });
}



