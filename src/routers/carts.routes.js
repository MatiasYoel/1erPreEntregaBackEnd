import { Router } from 'express';
import CartManager from '../Managers/CartManager.js';

const cartRouter = Router()

const cm = new CartManager()

cartRouter.get('/:cid', async (request, response) => {
    try {
        const { cid } = request.params
        if (isNaN(Number(cid))) {
            return response.status(400).send({ status: 'Error', message: 'Invalido' });
        }

        const result = await cm.getCartById(Number(cid))
        if (result.status === 'error') return response.status(400).send({ result });
        return response.status(200).send({ result });
    } catch (err) {
        console.log(err);
    }

})


cartRouter.post('/', async (request, response) => {
    try {
        const cart = request.body
        if (!Array.isArray(cart)) return response.status(400).send({ status: 'error', message: 'Error' });
        if (cart.length === 0) return response.status(400).send({ status: 'error', message: 'Carrito Vacio' })

        const result = await cm.addCart(cart)
        if (result.status === 'error') return response.status(400).send({ result });
        return response.status(200).send({ result });
    }
    catch (err) {
        console.log(err);
    }
})

cartRouter.post('/:cid/product/:pid', async (request, response) => {
    let { cid, pid } = request.params
    const quantity = request.body
    console.log(quantity);
    const result = await cm.addProductInCart(Number(cid), [{id:Number(pid), quantity: quantity.quantity}])
    return response.status(200).send({ result });
})


export default cartRouter