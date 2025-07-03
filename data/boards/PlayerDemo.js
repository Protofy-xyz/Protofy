const { boardConnect } = require('protonode')
const { Protofy } = require('protobase')

const run = Protofy("code",
    async ({ states, board }) => {
        // board.onChange({
        //     key: 'surname',
        //     changed: (value) => {
        //         board.log('Surname changed to:', value);
        //         board.execute_action({
        //             name: 'set_age'
        //         })
        //     }
        // })
    }
)

boardConnect(run)