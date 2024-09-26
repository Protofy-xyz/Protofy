import { createServer } from 'vite';

async function startVite() {
  const server = await createServer({
    root: process.cwd(),
    server: {
      port: 5173,
    },
  });

  await server.listen();

  console.log('Vite está corriendo en el puerto 5173');
}

startVite().catch((err) => {
  console.error('Error al arrancar Vite:', err);
});