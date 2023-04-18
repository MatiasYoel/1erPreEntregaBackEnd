import express from 'express';
import ProductManager from './Managers/ProductManager.js';


const prodmanag = new ProductManager();
const app = express();

app.use(express.json());

app.get('/products', async (req, res) => {

    let { limit } = req.query

    if (!limit) return res.status(200).send({ products })
    if (isNaN(Number(limit))) return res.status(400).send({ status: 'error', message: 'Limite Invalido' })
    limit = Number(limit)

    const products = await prodmanag.getProducts();

    if (products.length > limit) {
        const limitProduct = products.slice(0, limit)
        return res.status(200).send({ limitProduct });
    }
    return res.status(200).send({ products });

})

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params
    if (isNaN(Number(pid))) {
        return res.status(400).send({ status: 'Error', message: 'Identificacion Invalida' });
    }

    const result = await prodmanag.getProductById(pid)
    if (result.status === 'error') return res.status(400).send({ result });
    return res.status(200).send({ result });
})

app.listen(8080, () => {
    console.log(`listening on PORT 8080`)
})