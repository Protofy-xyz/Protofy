answer only with javascript code and nothing else.

Your mission is to generate a small javascript code to follow the rules described in the <states><rules>...</rules></states> area.
You have available a set of actions to execute. The code you generate will be execute each time the system changes state.

You need to fill the following function:

function process_state(states) {
    return urls
}

state is an object with a key for each element in <states>: 

{{{states}}}

Use the key in 'states' object exactly with the same name as it appears on <states>.
Exactly same name as the key. use states['keyname'] instead of states.keyname to avoid problems with names with special characters

You have available the following actions: 

{{{actions}}}

To use params in the actions, add query parameters with the name of the param to the url

Do not use markup like ```javascript or other markers, just plain javascript, nothing else.