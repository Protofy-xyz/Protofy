export const response = async (pendingOperation:Promise<any>, res:any, defaultValue=[], error="Error reading database") => {
    pendingOperation.then((data)=>{
      res.send(data);
    }).catch((err)=>{
      if (err.notFound) {
        res.send([]);
      } else {
        res.status(500).send("Error reading database");
        console.error('Error reading database: ', err)
      }
    })
  }