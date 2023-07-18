import fs from 'fs';

class ProductManager {

    constructor() {
        this.products = [];
        this.path = './src/DAO/fileSystem/products.json';

    };

    #validateCodeProduct = async (obj) => {

        let validateCode = this.products.find(property => property.code === obj.code);

        if (validateCode !== undefined) return { status: 'error', message: `No se pudo agregar el producto: '${obj.title}', codigo repetdio: '${obj.code}' ya existe` }
        return await this.#addId(obj);
    };


    #addId = async (obj) => {
        (this.products.length > 0)
            ? obj.id = this.products[this.products.length - 1].id + 1
            : obj.id = 1;
        this.products.push(obj)
        return await this.#saveProductsFS(obj.id);

    };

    #checkID = async (id) => {
        if (fs.existsSync(this.path)) {
            try {
                const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
                const parseProducts = JSON.parse(getFileProducts);

                const findObj = parseProducts.find(product => product.id === id);
                if (!findObj) return { status: 'error', message: 'ID no encontrado' };;
                return parseProducts;
            }

            catch (err) {
                console.log(err);
                return { status: 'error', message: err.message };
            }
        }
    };

    // Methods for Fyle System

    #saveProductsFS = async (id) => {
        try {
            const toJSON = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, toJSON)
            return { status: 'success', message: `Producto agregado con ID: ${id}` };
        }
        catch (err) {
            console.log(err);
            return { status: 'error', message: err.message };

        }
    };

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            try {
                const readJSON = await fs.promises.readFile(this.path, 'utf-8')

                return JSON.parse(readJSON)
            }
            catch (err) {
                console.log(err);
                return [];
            }
        }
        console.log(`El archivo no existe`);
        return [];

    };

    getProductById = async (id) => {
        id = Number(id);
        try {
            const result = await this.#checkID(id)

            if (result.status === 'error') return result

            
            const product = result.find(product => product.id === id)
            return { product };
        }
        catch (err) {
            console.log(err);
            return { status: 'error', message: err.message };
        }

    };

    updateProduct = async (pid, updateObject) => {
        
        try {
            const productsOfFS = await this.#checkID(pid)
            
            if (productsOfFS.status === 'error') return productsOfFS

            this.products = productsOfFS.map(element => {
                if (element.id === pid) {
                    element = Object.assign(element, updateObject);
                    return element
                }
                return element
            })

            this.#saveProductsFS(pid);
            
            return { status: 'success', message: 'Producto actualizado' }
        }
        catch (err) {
            console.log(err);
            return { status: 'error', message: err.message };
        }


    }

    deleteProduct = async (id) => {

        try {
            const result = await this.#checkID(id)

            if (result.status === 'error') return result

            

            this.products = result.filter(product => product.id !== id)

            this.#saveProductsFS(id)
            return { status: 'success', message: `Producto eliminado ID: ${id}` }
        }
        catch (err) {
            console.log(err);
            return { status: 'error', message: err.message };
        }


    }


    addProduct = async ({ title, description, price, code, stock, status, category, thumbnails }) => {
        try {
            this.products = await this.getProducts()

            if(price < 0 || stock < 0 ) return { status: 'error', message: 'Producto y stock no pueden ser menor o igual a cero' };
            const product = {
                title,
                description,
                price,
                code,
                stock,
                status,
                category,
                thumbnails
            }

            

            const result = Object.values(product).every(property => property)
            
            if (!result) return { status: 'error', message: 'No se pudo agregar el producto, incompleto' };
            
            if (!(typeof title === 'string' && 
                typeof description === 'string' && 
                typeof price === 'number' && 
                typeof code === 'string' && 
                typeof stock === 'number' && 
                typeof status === 'boolean' && 
                typeof category === 'string' && 
                Array.isArray(thumbnails))) 
                return { status: 'error', message:'Tipo de propiedad incorrecto' }

            return this.#validateCodeProduct(product)
        }
        catch (err) {
            console.log(err);
            return { status: 'error', message: err.message };
        }
    };
};

export default ProductManager;

