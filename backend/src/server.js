const app = require('./app');
const seed = require('./seed');

const PORT = process.env.PORT || 3001;

seed()
  .then(() => {
    app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('No se pudo iniciar la base de datos', err);
    process.exit(1);
  });
