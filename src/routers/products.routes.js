import { Router } from 'express';
import ProductManager from '../Managers/ProductManager.js';

const productsRouter = Router()

const pm = new ProductManager()

productsRouter.get('/', async (request, response) => {
    try {
        let { limit } = request.query

        const products = await pm.getProducts();
        if (!limit) return response.status(200).send({ products })
        if (isNaN(Number(limit))) return response.status(400).send({ status: 'error', message: 'Limite Invalido,vuelva a intentarlo' })
        
        limit = Number(limit)
        if (products.length > limit) {
            const limitProduct = products.slice(0, limit)
            return response.status(200).send({ limitProduct });
        }

        return response.status(200).send({ products });
    } catch (err) {
        console.log(err);
    }
})

productsRouter.get('/:pid', async (request, response) => {
    try {
        const { pid } = request.params
        if (isNaN(Number(pid))) {
        return response.status(400).send({ status: 'Error', message: 'Invalido' });
        }

        const result = await pm.getProductById(pid)
        if (result.status === 'error') return response.status(400).send({ result });
        return response.status(200).send({ result });
    } catch (err) {
        console.log(err);
    }

})

productsRouter.post('/', async (request, response) => {
    try {
        const product = request.body

        const result = await pm.addProduct(product)
        if (result.status === 'error') return response.status(400).send({ result });
        return response.status(200).send({ result });
    }
    catch (err) {
        console.log(err);
    }
})

productsRouter.put('/:pid', async (request, response) => {
    try {
        const { pid } = request.params
        const product = request.body

        const result = await pm.updateProduct(Number(pid), product)
        if (result.status === 'error') return response.status(400).send({ result });
        return response.status(200).send({ result })
    }
    catch (err) {
        console.log(err);
    };
})

productsRouter.delete('/:pid', async (request, response) => {
    try {
        const { pid } = request.params
        
        const result = await pm.deleteProduct(Number(pid))
        if (result.status === 'error') return response.status(400).send({ result });
        return response.status(200).send({ result });

    } catch (err) {
        console.log(err);
    }
})

export default productsRouter