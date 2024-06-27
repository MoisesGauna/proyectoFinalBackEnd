import {dirname} from "path"
import { fileURLToPath } from "url"
import { faker } from "@faker-js/faker/locale/es";
import multer from "multer";
import Datauri from "datauri/parser.js";
import path from "path";

export const __dirname=dirname(fileURLToPath(import.meta.url))

//Mocking

export const generateProduct = () => {
    return {
      _id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.commerce.isbn(),
      price: parseFloat(faker.commerce.price()),
      status: true,
      stock: parseFloat(faker.string.numeric(100)),
      category: faker.commerce.department(),
      thumbnail: faker.image.url(),
    };
    
};

//Multer config

const storage = multer.memoryStorage();

const multerUploads = multer({
  storage,
  // si se genera algun error, lo capturamos
  onError: function (err, next) {
    console.log(err);
    next();
  },
});
const dUri = new Datauri();
const dataUri = (files) => {
  return dUri.format(path.extname(files.originalname).toString(), files.buffer);
};

export { multerUploads, dataUri };
