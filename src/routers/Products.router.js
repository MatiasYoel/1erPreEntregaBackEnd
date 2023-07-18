import { passportCall } from '../middleware/auth.js';
import BaseRouter from './Router.js';
import productsController from '../controllers/products.controller.js';


export default class ProductsRouter extends BaseRouter {
    init() {
        this.get('/', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), passportCall('jwt', { strategyType: 'github' }), productsController.getProducts)

        this.get('/:pid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), productsController.getProductId)

        this.post('/', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), productsController.postProduct)

        this.put('/:pid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), productsController.putProduct)

        this.delete('/:pid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), productsController.deleteProduct)
    }

}

