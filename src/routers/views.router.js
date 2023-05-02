import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";

const viewRouter = Router();
const pm = new ProductManager()

viewRouter.get('/', async (req, res) => {
    try {
        const products = await pm.getProducts()
        console.log(products);
        res.render("index", { valueReturned: products })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({err})
    }

})

viewRouter.use('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {})
})

export default viewRouter