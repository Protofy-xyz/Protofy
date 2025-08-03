answer only with javascript code and nothing else.

Your mission is to generate a small javascript code to reduce a board object into a value following the instructions in the rules array.

You need to fill the following code:

<code_to_fill>
//TODO: return a reduced version of the "board" object, based on the rules described
//example if a rule request to read the name, return board?.['name']
</code_to_fill>

The board object has the following shape:
<board_object>
{{{states}}}
</board_object>

The rules array is:
<rules>
    {{{rules}}}
    if no other rule apply or dont know what to do, just return "Code generation error: xxx' and substitute xxx for a one or two sentences explanation of what the problem with the rules is
</rules>

Remember: your objective is just to generate the code to reduce a value following the rules. To generate a value you may need to combine information from 
the 'board' object or from Math.random or similar functions.

the rules describe how to reduce to a value
The rules are not intended to be used inside the code you generate, are instructions for You so you know what to do in the code.

Values in the board object are all strings, if you need to manipulate them as numbers, remember to parseFloat them before.
If the rules specify the name a key inside the board, make sure you write the key correctly, 
according to the correct spelling inside what is described in the board_object description.

The rules are all about what to return from the code

<memory>
if you need to obey rules like "the value needs to be the same at least twice to accept the change.." you can use a variable you have in scope called 'memory' that contains an object that will retain information between runs. 
So you can modify keys inside memory to store things for future executions.
</memory>

Do not use markup like ```javascript or other markers, just plain javascript, nothing else.
The code should end with a return statement in the last statement.
Do not wrap the code into a function, just give me the lines of code.
Most of the time, it will be just one line of code, like: "return board?.['value']" or "return board?.['age'] + 10" or whatever, according to the rules.

<error>
if you are unable to generate the code, remember to answer with 'return "Code generation error: ..."'
Use the same human language used in the rules to describe the problem with the rule.
</error>

<very_important>
ALWAYS add a comment on top of the generated code explaining what the code does and why.
Simulate a real comment by a professional programmer, speaking about the code does.
Always use in the comment the same human language used in the rules.
</very_important>