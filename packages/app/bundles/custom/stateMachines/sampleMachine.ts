import { Protofy } from "protobase";

export default Protofy("machineDefinition", {
    context: {
        count: 0,
    },
    initial: "idle",
    states: {
        idle: {
            on: {
                "CHANGE": "waiting"
            }
        },
        waiting: {
            entry: () => {
                console.log("Changed to waiting")
            }
        }
    },
    on: {
        INC: {
        },
        DEC: {
        },
        SET: {
        },
    },
})
