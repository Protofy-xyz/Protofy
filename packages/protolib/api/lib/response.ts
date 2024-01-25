import { getLogger } from '../../base';

const logger = getLogger()

export const response = async (pendingOperation:Promise<any>, res:any, defaultValue=[], error="Error reading database") => {
    pendingOperation.then((data)=>{
      res.send(data);
    }).catch((err)=>{
      if (err.notFound) {
        res.send([]);
      } else {
        res.status(500).send("Error reading database");
        logger.error({ error: err }, `Error reading database: ${err.message}`);
      }
    })
  }