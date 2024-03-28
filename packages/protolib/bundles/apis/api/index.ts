export const automation = (name,app,cb)=>{
    const url = "/api/v1/automations/"+name;
    console.log("REGISTERING API: ", url )
    app.get(url,(req,res)=>{
        cb(req.query)
        res.send("OK");
    })
}