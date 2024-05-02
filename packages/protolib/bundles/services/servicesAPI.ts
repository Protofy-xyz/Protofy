import { handler } from '../../api'

import pm2 from 'pm2';


export const ServicesAPI = (app, context) => {
  app.get('/adminapi/v1/services', handler(async (req, res, session) => {
    if (!session || !session.user.admin) {
      res.status(401).send({ error: "Unauthorized" })
      return
    }
    // Conexión a PM2
    pm2.connect(err => {
      if (err) {
        console.error('Error al conectar con PM2:', err);
        process.exit(2);
      }

      // Listar todos los procesos gestionados por PM2
      pm2.list((err, list) => {
        if (err) {
          console.error('Error al listar los procesos:', err);
          pm2.disconnect(); // Desconecta la conexión con el daemon de PM2
          return;
        }
        res.send(list)
        console.log('Lista de procesos:', list);
        pm2.disconnect(); // Desconecta la conexión con el daemon de PM2
      });
    });
  }))
}



