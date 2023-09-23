import {
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

function isInteractiveElement(element) {
    const interactiveElements = [
        "button",
        "input",
        "textarea",
        "select",
        "option",
    ];

    if (interactiveElements.includes(element.tagName.toLowerCase())) {
        return true;
    }

    return false;
}

//@ts-ignore
class MyPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: "onPointerDown",
            handler: ({ nativeEvent: event }) => {
                if (
                    !event.isPrimary ||
                    event.button !== 0 ||
                    isInteractiveElement(event.target)
                ) {
                    return false;
                }

                return true;
            },
        },
    ];
}


export const useTouchSensors = () => {
    return useSensors(
        //@ts-ignore
        useSensor(MyPointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
}