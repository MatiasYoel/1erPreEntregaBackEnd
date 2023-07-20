import { userService, productService, cartService, ticketsService } from '../services/index.js'

const getUserCarts = async (req, res) => {

    try {

        const carts = await cartService.getCartsByUserService(req.user.id)
        console.log(carts, 'Carrito');

        return res.sendSuccessWithPayload(carts[0])
    } catch (error) {

        return res.sendInternalError(error)
    }
}

const getCartId = async (req, res) => {
    try {
        const { cid } = req.params
        console.log(cid);

        const result = await cartService.getCartByIdService(cid)
        console.log(result);
        if (result === null || typeof (result) === 'string') return res.status(404).send({ status: 'error', message: 'ID no encontrado' });
        return res.sendSuccessWithPayload(result);
    } catch (error) {
        return res.sendInternalError(error)
    }

}

const postCart = async (req, res) => {
    try {
        const { products, userId } = req.body

        const user = await userService.getUsersByIdService(userId)


        if (!Array.isArray(products)) return res.sendNotFound({ status: 'error', message: 'TypeError' });

        // Corroborar si todos los ID de los productos existen
        const results = await Promise.all(products.map(async (product) => {
            const checkId = await productService.getProductByIdService(product._id);
            if (checkId === null || typeof (checkId) === 'string') return `Producto con ID: ${product._id} no encontrado`
        }))

        const check = results.find(value => value !== undefined)
        if (check) return res.sendNotFound(check)

        const cart = await cartService.addCartService({ userId, products })

        const addCartInUser = await userService.addCartService({ userId: cart.user, cartId: cart._id })

        return res.sendSuccess(cart);

    }
    catch (error) {
        return res.sendInternalError(error.message)

    }
}

const postProductInCart = async (req, res) => {
    try {

        let { cid, pid } = req.params
        const { quantity } = req.body

        if (isNaN(Number(quantity)) || !Number.isInteger(quantity)) return res.status(400).send({ status: 'error', payload: null, message: 'Cantidad Invalida' })

        if (quantity < 1) return res.status(400).send({ status: 'error', payload: null, message: 'La cantidad debe ser mayor que 1' })

        const checkIdProduct = await productService.getProductByIdService(pid);


        if (checkIdProduct === null || typeof (checkIdProduct) === 'string') return res.status(404).send({ status: 'error', message: `Producto con ID: ${pid} no encontrado` })

        const checkIdCart = await cartService.getCartByIdService(cid)

        if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ status: 'error', message: `Carrito con ID: ${cid} no encontrado` })

        const result = await cartService.addProductInCartService(cid, { _id: pid, quantity })

        return res.status(200).send({ message: `Producto añadido con ID: ${pid}, carrito ID: ${cid}`, cart: result });

    } catch (error) {
        return res.sendInternalError(error)
    }
}

const putCart = async (req, res) => {
    try {
        const { cid } = req.params
        const { products } = req.body

        const results = await Promise.all(products.map(async (product) => {
            const checkId = await productService.getProductByIdService(product._id);

            if (checkId === null || typeof (checkId) === 'string') {
                return res.status(404).send({ status: 'error', message: `Producto con ID: ${product._id} no encontrado` })
            }
        }))
        const check = results.find(value => value !== undefined)
        if (check) return res.status(404).send(check)


        const checkIdCart = await cartService.getCartByIdService(cid)
        if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ status: 'error', message: `Carrito con ID: ${cid} no encontrado` })

        const cart = await cartService.updateProductsInCartService(cid, products)
        return res.status(200).send({ status: 'success', payload: cart })
    } catch (error) {
        return res.sendInternalError(error)
    }

}

const productInCart = async (req, res) => {
    try {

        let { cid, pid } = req.params
        const { quantity } = req.body


        const checkIdProduct = await productService.getProductByIdService(pid);

        if (checkIdProduct === null || typeof (checkIdProduct) === 'string') return res.status(404).send({ status: 'error', message: `Producto con ID: ${pid} no encontrado` })

        const checkIdCart = await cartService.getCartByIdService(cid)


        if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ error: `Carrito con ID: ${cid} no encontrado` })

        const result = checkIdCart.products.findIndex(product => product._id._id.toString() === pid)


        if (result === -1) return res.status(404).send({ status: 'error', payload: null, message: `Producto con ID: ${pid} no se puede actualizar porque no está en el carrito` })

        if (isNaN(Number(quantity)) || !Number.isInteger(quantity)) return res.status(400).send({ status: 'error', payload: null, message: 'Cantidad Invadlida' })

        if (quantity < 1) return res.status(400).send({ status: 'error', payload: null, message: 'La cantidad debe ser mayor que 1' })

        checkIdCart.products[result].quantity = quantity


        const cart = await cartService.updateOneProduct(cid, checkIdCart.products)
        res.status(200).send({ status: 'success', cart })

    } catch (error) {
        return res.sendInternalError(error)
    }
}

const deleteProductInCart = async (req, res) => {
    try {

        const { cid, pid } = req.params

        const checkIdProduct = await productService.getProductByIdService(pid);

        if (checkIdProduct === null || typeof (checkIdProduct) === 'string') return res.status(404).send({ status: 'error', message: `Producto con ID: ${pid} no encontrado` })

        const checkIdCart = await cartService.getCartByIdService(cid)
        if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ status: 'error', message: `Carrito con ID: ${cid} no encontrado` })

        const findProduct = checkIdCart.products.findIndex((element) => element._id._id.toString() === checkIdProduct._id.toString())

        if (findProduct === -1) return res.status(404).send({ error: `Producto con ID: ${pid} no encontrado en el Carrito` })

        checkIdCart.products.splice(findProduct, 1)

        const cart = await cartService.deleteProductInCartService(cid, checkIdCart.products)

        return res.status(200).send({ status: 'success', message: `Producto eliminiado ID: ${pid}`, cart })
    } catch (error) {
        console.log(error);
        return res.sendInternalError(error)
    }
}

const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params
        const checkIdCart = await cartService.getCartByIdService(cid)

        if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ error: `Carrito con ID: ${cid} no encontrado` })

        if (checkIdCart.products.length === 0) return res.status(404).send({ status: 'error', payload: null, message: 'Carrito Vacio' })

        checkIdCart.products = []

        const cart = await cartService.updateOneProduct(cid, checkIdCart.products)
        return res.status(200).send({ status: 'success', message: `Carrito con ID: ${cid} vaciado`, cart });

    } catch (error) {
        return res.sendInternalError(error)
    }
}

const purchaseCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const { amount } = req.body
        const cart = await cartService.getCartByIdService(cid)

        let insufficientProducts = [];
        let productPurchase = [];

        for (let product of cart.products) {
            if (product._id.stock < product.quantity) {
                insufficientProducts.push(product);
            } else {
                product._id.stock -= product.quantity
                await productService.updateProductService(product._id._id, product._id)
                productPurchase.push(product);
            }
        }

        const preTicket = {
            user: req.user.id,
            cart: cid,
            amount
        }

        if (!amount) return res.status(403).send({ message: 'Producto no Disponible' });
        await ticketsService.addTicketService(preTicket)
        await cartService.updateProductsInCartService(cid, insufficientProducts)

        return res.sendSuccess('Successful purchase')
    } catch (error) {

        return res.sendInternalError(error)
    }

};


export default {
    getUserCarts,
    getCartId,
    postCart,
    postProductInCart,
    putCart,
    productInCart,
    deleteProductInCart,
    deleteCart,
    purchaseCart
}