import { generateProduct } from "../utils.js";

export const getProductsMocking = async (req, res)=>{
    try {
        let products = [];

        for (let i = 0; i < 100; i++) {
            products.push(generateProduct());
            console.log(products)
        }
        res.send({ status: "success", payload: products });
        console.log(products)
    } catch (error) {
        req.logger.error("Error al generar usuarios mock: "+error.message)
        res.status(500).send({ error: error.message, message: "No se pudo obtener los usuarios:" });
    }
}