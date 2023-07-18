
import { passportCall } from '../middleware/auth.js';
import BaseRouter from './Router.js';
import cartsController from '../controllers/carts.controller.js';

export default class CartsRouter extends BaseRouter {
    init() {

        this.get('/usercarts', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.getUserCarts)
        // Devuelve un carrito
        this.get('/:cid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.getCartId)

        // Crea un carrito con o sin productos
        this.post('/', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.postCart)

        // Coloca la cantidad de un producto
        this.post('/:cid/product/:pid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.postProductInCart)


        // Actualiza la lista de productos 
        this.put('/:cid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.putCart)

        this.put('/:cid/product/:pid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.productInCart)


        // Elimina un producto dado
        this.delete('/:cid/product/:pid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.deleteProductInCart)

        // Elimina todos los productos de un carrito
        this.delete('/:cid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.deleteCart)
        
        // Revisa stock y realiza la compra.

        this.post('/:cid/purchase', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.purchaseCart)


    }
};

