import { handler } from '../../api'
import fs from 'fs';
import pm2 from 'pm2';


export const ServicesAPI = (app, context) => {
  app.get('/adminapi/v1/services', handler(async (req, res, session) => {
    if (!session || !session.user.admin) {
      res.status(401).send({ error: "Unauthorized" })
      return
    }

    pm2.connect(err => {
      if (err) {
        console.error('Error connecting to pm2:', err);
        res.status(500).send({ error: "Error connecting to pm2" })
        return
      }

      pm2.list((err, list) => {
        if (err) {
          res.status(500).send({ error: "Error getting list of services" })
          pm2.disconnect();
          return;
        }
        res.send(list)
        pm2.disconnect();
      });
    });
  }))

  app.get('/adminapi/v1/services/:service', handler(async (req, res, session) => {
    if (!session || !session.user.admin) {
      res.status(401).send({ error: "Unauthorized" })
      return
    }

    pm2.connect(err => {
      if (err) {
        console.error('Error connecting to pm2:', err);
        res.status(500).send({ error: "Error connecting to pm2" })
        return
      }

      pm2.describe(req.params.service, (err, desc) => {
        if (err) {
          res.status(500).send({ error: "Error getting service" })
          pm2.disconnect();
          return;
        }
        res.send(desc)
        pm2.disconnect();
      });
    });
  }))

  app.get('/adminapi/v1/services/:service/logs', handler(async (req, res, session) => {
    if (!session || !session.user.admin) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }
  
    //@ts-ignore
    const linesRequested = req.query.lines ? parseInt(req.query.lines, 10) : 5000;
    if (isNaN(linesRequested)) {
      res.status(400).send({ error: "Invalid lines parameter" });
      return;
    }
  
    pm2.connect(err => {
      if (err) {
        console.error('Error connecting to pm2:', err);
        res.status(500).send({ error: "Error connecting to pm2" });
        return;
      }
  
      pm2.describe(req.params.service, (err, desc) => {
        pm2.disconnect();
        if (err || desc.length === 0) {
          res.status(500).send({ error: "Error getting service description" });
          return;
        }
  
        const logFilePath = desc[0].pm2_env.pm_out_log_path;
  
        readLastNLines(logFilePath, linesRequested).then(logs => {
          res.send(logs);
        }).catch(fileErr => {
          console.error('Error reading log files:', fileErr);
          res.status(500).send({ error: "Error reading log files" });
        });
      });
    });
  }));
  
  async function readLastNLines(file, n) {
    const stats = fs.statSync(file);
    const chunkSize = 1024;
    let filePosition = stats.size - chunkSize;
    let linesCount = 0;
    let output = '';
  
    while (filePosition > 0 && linesCount < n) {
      const buffer = Buffer.alloc(chunkSize);
      let bytesRead = fs.readSync(fs.openSync(file, 'r'), buffer, 0, chunkSize, filePosition);
      output = buffer.toString('utf8') + output;
      linesCount = (output.match(/\n/g) || []).length;
      filePosition -= chunkSize;
    }
  
    if (linesCount >= n) {
      output = output.split('\n').slice(-n).join('\n');
    }
  
    return output;
  }
}



