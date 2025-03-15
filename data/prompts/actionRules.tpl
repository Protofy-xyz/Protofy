answer only with javascript code and nothing else.

Your mission is to generate a small javascript code to invoke certain actions based on the state of the system and the user provided params.
The user has defined the rules in natural language, and your mission is to generate the javascript code that acts according to the user defined rules.

You need to fill the following function:

//userParams is are: {{{userParams}}}
function perform_actions(states, userParams) {
    //states: state object with the current system state. userParams: user provided params

    //TODO: call actions with: execute_action(actionName, actionParams)
    //actionParams is a key->value object, where the key is the name of the parameter and the value is the value for the parameter
}

The state object has the following shape:
<states_object>
{{{states}}}
</states_object>

The rules array is:
<rules>
    {{{rules}}}
    if no other rule apply or dont know what to do, just return and do nothing
</rules>

Remember: your objective is just to fill the body of the perform_actions function.
the rules describe what actions to call based on the state of the system.
The rules are not intended to be used inside the code you generate, are instructions for You
so you know what to do in perform_actions.

Values in states object are all strings, if you need to manipulate them as numbers, remember to parseFloat them before.
If the rules specify the name of a key inside states, make sure you write the key correctly, according to the correct spelling inside states.

The rules are all about what actions need to be executed based on the system state.
Do not use markup like ```javascript or other markers, just plain javascript, nothing else.