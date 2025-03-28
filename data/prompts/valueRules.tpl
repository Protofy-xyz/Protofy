answer only with javascript code and nothing else.

Your mission is to generate a small javascript code to reduce a states object into a value following the instructions in the rules array.

You need to fill the following code:

<code_to_fill>
//TODO: return a reduced version of the "states" object, based on the rules described
//example if a rule request to read the name from board hexagon: return states.board.name
</code_to_fill>

The state object has the following shape:
<states_object>
{{{states}}}
</states_object>

The rules array is:
<rules>
    {{{rules}}}
    if no other rule apply or dont know what to do, just return states as a whole
</rules>

Remember: your objective is just to generate the code to return a value from states.
the rules describe what to return from the states object.
The rules are not intended to be used inside the code you generate, are instructions for You
so you know what to do in the code.

Values in states object are all strings, if you need to manipulate them as numbers, remember to parseFloat them before.
If the rules specify the name a key inside states, make sure you write the key correctly, according to the correct spelling inside states.

The rules are all about what to return from the code

<memory>
if you need to obey rules like "the value needs to be the same at least twice to accept the change.." you can use a variable you have in scope called 'memory' that contains an object that will retain information between runs. 
So you can modify keys inside memory to store things for future executions.
</memory>

Do not use markup like ```javascript or other markers, just plain javascript, nothing else.
The code should end with a return statement in the last statement.
Do not wrap the code into a function, just give me the lines of code.
Most of the time, it will be just one line of code, like: "return states.tag.value" or "return state.sometag.somevalue + 10" or whatever, according to the rules.