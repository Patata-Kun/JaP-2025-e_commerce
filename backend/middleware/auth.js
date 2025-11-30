const jwt = require("jsonwebtoken");

//MIDDLEWARE PARA PROTEGER RUTAS
function authMiddleware(req, res, next) {
  
  const token = req.headers["authorization"];

  //SI NO HAY TOKEN NO TE DEJA
  if (!token) {
    return res.status(401).json({ message: "Token no enviado" });
  }

  try {
    //VERIFICAR TOKEN
    const decoded = jwt.verify(token, "CLAVE_SECRETA");

    //GUARDAMOS DATOS DEL USUARIO
    req.user = decoded;

    //SI TODO ESTA BIEN SEGUÍS
    next();

  } catch (error) {
    return res.status(403).json({ message: "Token inválido o vencido" });
  }
}

module.exports = authMiddleware;
