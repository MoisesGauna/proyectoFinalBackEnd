import CustomError from "../errors/CustomError.js";
import EErrors from "../errors/errors-enum.js";
import { IdProductErrorInfo } from "../errors/messages/product-creation-error.message.js";

class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getProducts() {
        try {
            return await this.dao.getProducts();
        } catch (err) {
            return err;
        }
    }

    async getProductById(id) {
        try {
            const result = await this.dao.getProductById(id);            
            return result
        } catch (err) {
            
            CustomError.createError({
                name: "Product ID Error",
                cause: IdProductErrorInfo(id),
                message: `El producto con id ${id}, no existe`,
                code: EErrors.INVALID_TYPES_ERROR,
            })
        }
    }

    async addProduct(product) {
        try {
            await this.dao.addProduct(product);
            
        } catch (err) {
            return err;
        }
    }

    async updateProduct(id, product) {
        try {
            await this.dao.updateProduct(id, product);
        } catch (err) {
            return err;
        }
    }

    async deleteProduct(id) {
        try {
            return await this.dao.deleteProduct(id);
        } catch (err) {
            return err;
        }
    }
}

export { ProductsRepository };