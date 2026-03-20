const authService = require('../services/auth.service');

const login = async (req, res, next) => {
  try {

    const { NombreUsuario, Contrasena } = req.body;

    const user = await authService.login(NombreUsuario, Contrasena);

    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    res.json(user);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  login
};