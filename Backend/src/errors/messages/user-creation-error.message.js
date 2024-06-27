export const resetPasswordErrorInfo = (req) => {
    req.logger.error(`El enlace para modificar la contraseña ha expirado, deberas generar uno nuevo.
      `);
  };
  