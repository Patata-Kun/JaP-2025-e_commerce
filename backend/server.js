const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// PERMITIR PETICIONES DEL FRONTEND
app.use(cors());

// SERVIR TODA LA CARPETA /data COMO API
app.use("/api", express.static(path.join(__dirname, "data")));

// PROBAR SERVIDOR
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// LEVANTAR SERVIDOR
app.listen(PORT, () => {
  console.log("Servidor levantado en http://localhost:" + PORT);
});
