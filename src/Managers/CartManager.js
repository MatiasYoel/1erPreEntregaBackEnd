import fs from 'fs';
import ProductManager from './ProductManager.js';

const pm = new ProductManager()

class CartManager {

    constructor() {
        this.carts = [];
        this.path = './src/Managers/carts.json';
        if (!fs.existsSync(this.path)) return this.createCart(this.carts);
    };

    createCart = async (file) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(file, null, 2));
        }
        catch (err) {
            console.log(err.message);
            return { status: 'error', message: err.message };
        }
    }

    validateProductsCart = async (listProducts) => {

        let boolean = true;
        for (let product of listProducts) {
            let result = await pm.getProductById(product.id)
            console.log(result);
            if (result.status === 'error') boolean = false;
        }
        return boolean;
    };

    getCartById = async (cartId) => {
        try {
            const getCarts = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(getCarts);

            const findProductId = this.carts.find(cart => cart.id === cartId);
            if (!findProductId) return { status: 'error', message: 'No se encontro el ID' };

            return findProductId;
        } catch (err) {
            console.log(err);
            return { status: 'error', message: err.message };
        }

    }

    addCart = async (products) => {
        try {

            const resultProducts = await this.validateProductsCart(products);
            if (resultProducts) return { status: 'error', message: 'No se encontro el producto' };


            let result = await fs.promises.readFile(this.path, 'utf-8')
            if (result !== '') this.carts = JSON.parse(result);

            const cart = {
                products: products
            };

            (this.carts.length > 0)
                ? cart.id = this.carts[this.carts.length - 1].id + 1
                : cart.id = 1;

            this.carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            return { status: 'success', message: '¡Carrito enviado con exito!' };
        }
        catch (err) {
            console.log(err.message);
            return { status: 'error', message: err.message };
        }
    }

    addProductInCart = async (cid, productFromBody) => {

        try {
            const resultProducts = await this.validateProductsCart(productFromBody);
            if (!resultProducts) return { status: 'error', message: 'No se encontro el producto' };

            const cartResult = await this.getCartById(cid);
            if (cartResult.status === 'error') return cartResult

            const findProduct = cartResult.products.findIndex(product => product.id === productFromBody[0].id)
            console.log(findProduct, 'Se encontro el producto');
            if (findProduct !== -1) {
                cartResult.products[findProduct].quantity = Number(cartResult.products[findProduct].quantity) + productFromBody[0].quantity;
                
            }
            else{
                cartResult.products.push(productFromBody[0]);
            }
            
            this.carts.map(element => {
                    if (element.id === cid) {
                        element = Object.assign(element, cartResult);
                        return element
                    }
                    return element
                })
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            return { status: 'success', message: '¡Carrito actualizado con exito!', products: cartResult };
        }
        catch (err) {
            console.log(err.message);
            return { status: 'error', message: err.message };
        }
    }
};

export default CartManager;


