import { logger } from "../../config/logger-config.js";


export const generateFieldProductErrorInfo = (product) => {
    logger.error(`Una o más propiedades fueron enviadas incompletas o no son válidas.
          Lista de propiedades requeridas:
  
              -> title: type String, recibido: ${product[0]}
              -> description: type String, recibido: ${product[1]}
              -> price: type String, recibido: ${product[2]}
              -> code: type String, recibido: ${product[3]}
              -> category: type String, recibido: ${product[4]}
              -> stock: type String, recibido: ${product[5]}
      `);
};

export const generateCodeProductErrorInfo = (code) => {
    logger.error(`La propiedad code, ya existe dentro de la DB para otro producto.
          Propied requerida:
  
              -> code: type String, recibido: ${code.code} ya existente.
      `);
};

export const filterProductErrorInfo = (field) => {
    logger.error(`
      El campo que desea filtrar no existe.
          Propied requerida:
  
              -> Campo recibido: ${field}.
      `);
};

export const IdProductErrorInfo = (req, pid) => {
    req.logger.error(`
      El Id ingresado no corresponde a ningun producto de la DB.
          Propied requerida:
  
              -> Id recibido: ${pid}.
      `);
};
