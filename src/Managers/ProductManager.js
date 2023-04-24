import fs from 'fs';

class ProductManager {

    constructor() {
        this.products = [];
        this.path = './src/Managers/productos.json';
    };

    validateCode = async (obj) => {
        let validateCode = this.products.find(property => property.code === Object.values(obj)[4]);
        if (validateCode) return console.log(`Code Existente: "${obj.code}"`)
        await this.addId(obj);
    };


    addId = async (obj) => {
        (this.products.length > 0)
            ? obj.id = this.products[this.products.length - 1].id + 1
            : obj.id = 1;
        this.products.push(obj)
        await this.saveProducts();

    };

    checkId = async (id) => {
        try {
            const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
            const parseProducts = JSON.parse(getFileProducts);

            const findObj = parseProducts.find(product => product.id === id);
            if (!findObj) return null;
            return parseProducts;
        }

        catch (err) {
            console.log(err);
        }

    };

    saveProducts = async () => {
        try {
            const toJSON = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, toJSON)
            return;
        }
        catch (err) {
            return console.log(err);

        }
    };

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            try {
                const readJSON = await fs.promises.readFile(this.path, 'utf-8')
                console.log(`Todos los Productos:\n`, JSON.parse(readJSON));
                return JSON.parse(readJSON)
            }
            catch (err) {
                console.log(err);
                return [];
            }
        }
        console.log(`No existe`);
        return [];
    };

    getProductById = async (id) => {
        id = Number(id);
        try {
            const products = await this.checkId(id)
            // console.log(products);
            if (!products) {
                return {status:'error', message: `Producto no encontrado. ID: ${id}`};
            }
            const product = products.find(product => product.id === id)
            return {status:'success', product: product};
        }
        catch (err) {
            return console.log(err);
        }
    };

    updateProduct = async (pid, updateObject) => {
        try {
            const productsOfFS = await this.checkId(pid)

            this.products = productsOfFS.map(element => {
                if(element.id == pid){
                    element = Object.assign(element, updateObject);
                    return element
                }
                return element
            })

            this.saveProducts();
            return console.log(`Producto Actualizado:`, this.products);
        }
        catch (err) {
            return console.log(err);
        }
    }

    deleteProduct = async (id) => {

        try {
            const products = await this.checkId(id)
            if (!products) return console.log(`Producto no encontrado. ID: ${id}`);

            this.products = products.filter(product => product.id !== id)

            this.saveProducts()
            return console.log(`Producto de ID:"${id}" eliminado`);;
        }
        catch (err) {
            return console.log(err);
        }
    }

    addProduct = async (title, description, price, thumbail, code, stock) => {
        this.products = await this.getProducts()
        console.log(this.products)
        const product = {
            title,
            description,
            price,
            thumbail,
            code,
            stock
        }

        (Object.values(product).every(property => property))
            ? this.validateCode(product)
            : console.log('Producto no añadido');
    };
};

export default ProductManager;

