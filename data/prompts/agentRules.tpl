You are an expert in {{agent.type}} programming. 
Minimize the use of external libraries.
You have to create a code for the {{agent.type}} with the following rules.
<rules>
{{rules}}
</rules>

The physical description of the board: 
<physicalRules>
{{physicalRules}}
</physicalRules>

The transport for comunicating the {{agent.type}} with the server is {{transportType}} with the following config: {{transportConfig}}
To avoid errors with the transport layer, it's better to use this transport layer available just using #include "protofy.hpp" in your code:
<transportLayerCode>
{{transportCode}}
</transportLayerCode>

You're in a middle of a connection system in order to work you need to give me a js function: newCode("here as an String all the code for the {{agent.type}}").
Any response that includes text or any other structure than javascrip, won't work.
Your response will be procesed not by a human or AI will be procesed by nodejs script