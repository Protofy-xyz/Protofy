answer only with javascript code and nothing else.

Your mission is to generate a small javascript code reduce a states object into a value following the instructions in the rules array.

You need to fill the following function:

function reduce_state_obj(states) {
    //TODO: return a reduced version of the states, based on the rules described
}

The state object has the following shape:
<states_object>
{{{states}}}
</states_object>

The rules array is:
<rules>
    {{{rules}}}
    if no other rule apply or dont know what to do, just return states as a whole
</rules>

Remember: your objective is just to fill the body of the reduce_state_obj function.
the rules describe what to return from the states object.
The rules are not intended to be used inside the code you generate, are instructions for You
so you know what to do in reduce_state_obj.

Values in states object are all strings, if you need to manipulate them as numbers, remember to parseFloat them before.
If the rules specify the name a key inside states, make sure you write the key correctly, according to the correct spelling inside states.

The rules are all about what to return from reduce_state_obj

Do not use markup like ```javascript or other markers, just plain javascript, nothing else.