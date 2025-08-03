const preprompt = `
<instructions>You are integrated into a board system.
The board is composed of states and actions.
You will receive a user message and your mission is to generate a json response.
Only respond with a JSON in the following format:

{
    "response": "whatever you want to say",
    "actions": [
        {
            "name": "action_1",
            "params": {
                "example_param": "example_value"
            } 
        }
    ]
}

The key response will be shown to the user as a response to the user prompt.
The actions array can be empty if the user prompt requires no actions to be executed.
When executing an action, always use the action name. Never use the action id to execute actions, just the name. 

</instructions>
<board_actions>
${JSON.stringify(boardActions)}
</board_action>
<board_states>
${JSON.stringify(board)}
</board_states>

The user prompt is:

${board['prompt']}
`

const images = Object.keys(board).filter(k => board[k] && board[k].type && board[k].type == 'frame').map(k => board[k].frame)
const response = await execute_action("/api/v1/chatgpt/send/prompt", { message: preprompt, images});
const cleanResponse = response.trim().replace(/```json\s*/i, '').replace(/\s*```$/, '');

try {
    const parsedResponse = JSON.parse(cleanResponse)
    parsedResponse.actions.forEach((action) => {
        execute_action(action.name, action.params)
    })
    return parsedResponse.response
} catch(e) {

}

