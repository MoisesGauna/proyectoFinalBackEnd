
// import CartManager from "../dao/filemanagers/controllers/cartManager.js"
// const manager=new CartManager(__dirname+'/dao/filemanagers/db/carts.json')



import { Router } from "express"
import { __dirname } from "../utils.js"
import CartManager from "../dao/mongoDB/mongomanagers/cartManagerMongo.js"
import ProductManager from "../dao/mongoDB/mongomanagers/productManagerMongo.js"


const cm = new CartManager()
const pm = new ProductManager()


const router = Router()

router.get("/carts", async (req, res) => {
    const carrito = await cm.getCarts()
    res.json({ carrito })
})

router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const carritofound = await cm.getCartById(cid);
        console.log(carritofound)
        if (carritofound === null) {
            return res.status(404).json({ message: `Cart with ID: ${cid} not found` });
        }
        res.json({ status: "success", carritofound });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "An error occurred while processing the request" });
    }
});



router.post('/carts', async (req, res) => {
    try {
        const { obj } = req.body;

        if (!Array.isArray(obj)) {
            return res.status(400).send('Invalid request: products must be an array');
        }

        const validProducts = [];

        for (const product of obj) {
            const checkId = await pm.getProductById(product._id);
            if (checkId === null) {
                return res.status(404).send(`Product with id ${product._id} not found`);
            }
            validProducts.push(checkId);
        }

        const cart = await cm.addCart(validProducts);
        res.status(200).send(cart);

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});



router.post("/cart/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const checkIdProduct = await pm.getProductById(pid);
        console.log(checkIdProduct)

        if (!checkIdProduct) {
            return res.status(404).send({ message: `Product with ID: ${pid} not found` });
        }

        const checkIdCart = await cm.getCartById(cid);
        if (!checkIdCart) {
            return res.status(404).send({ message: `Cart with ID: ${cid} not found` });
        }

        const result = await cm.addProductInCart(cid, checkIdCart, pid, quantity );
        return res.status(200).send({
            message: `Product with ID: ${pid} added to cart with ID: ${cid}`,
            cart: result,
        });
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).send({ message: "An error occurred while processing the request" });
    }
});



export default router