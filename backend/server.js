const express = require("express");
const cors = require("cors");
const path = require("path");
const authMiddleware = require("./middleware/auth");
const jwt = require("jsonwebtoken"); //ACÁ LE PIDO A NODE.JS QUE IMPORTE LA LIBRERÍA jsonwebtoken Y QUE DESPUÉS LA GUARDE EN UNA VARIABLE.

const app = express();
const PORT = 3000;

//PERMITIR PETICIONES DEL FRONTEND
app.use(cors());
app.use(express.json()); //ESTO PERMITE QUE EXORESS PUEDA ENTENDER/LEER LO QUE LE MANDO DESDE EL FRONTEND. SIN EL express.json() EL BACKEND NO LO ENTIENDE

//ACTIVAR MIDDLEWARE
app.use("/api", authMiddleware);

//RUTAS PROTEGIDAS
app.use("/api", express.static(path.join(__dirname, "data")));




const users = [ //ACÁ CREÉ UNA BASE DE DATOS PEQUEÑA Y LE DI ALGUNOS NOMBRES DE USUARIO Y CONTRASEÑA PARA PROBAR INICIAR SESIÓN CON ELLOS.
  { id: 1, username: "jeremias", password: "12345" },
  { id: 2, username: "leo", password: "12345" },
  { id: 3, username: "jazmin", password: "12345"},
  { id: 4, username: "kenny", password:"12345"},
  { id: 5, username: "naty", password: "12345"}
]; //CUANDO PRUEBO INICIAR SESIÓN SI LOS DATOS QUE INGRESO SON CORRESPONDIENTES A ESTA BASE DE DATOS, LOGRO HACER LOGIN, SINO NO.



app.post("/login", (req, res) => { //CUANDO INTENTE HACER LOGIN.
  const { username, password } = req.body; //req.body VA A EXTRAER LAS PROPIEDADES DE USUARIO Y CONTRASEÑA DESDE EL OBJETO.

  const user = users.find( // BUSCA ENTONCES QUE EL USUARIO Y LA CONTRASEÑA COINCIDAN.
    (u) => u.username === username && u.password === password
  );

  if (!user) { //SI LOS DATOS DE USUARIO INGRESADOS NO COINCIDEN CON UNO DENTRO DE MI BASE DE DATOS, ME DA ERROR.
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
  }

  const token = jwt.sign( // SI COINCIDEN, SE GENERA EL TOKEN, UN TOKEN QUE TIENE userId y Username
    { userId: user.id, username: user.username },
    "CLAVE_SECRETA", //SIRVE COMO UNA ESPECIE DE FIRMA O SELLO EN CADA TOKEN Y ASÍ, ES VALIDO, SOLO EL SERVDIDOR LO CONOCE.
    { expiresIn: "2h" } //EL TOKEN TENDRÁ UNA DURABILIDAD DE 2 HORAS, DESPUÉS DE ESTE TIEMPO EL USUARIO TIENE QUE HACER LOGIN OTRA VEZ.
  );

  res.json({ token }); //LE DEVUELVO AL CLIENTE, EL TOKEN.
});


// PROBAR SERVIDOR
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// LEVANTAR SERVIDOR
app.listen(PORT, () => {
  console.log("Servidor levantado en http://localhost:" + PORT);
});


