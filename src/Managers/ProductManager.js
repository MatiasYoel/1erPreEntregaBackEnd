import fs from 'fs';

class ProductManager {

    constructor() {
        this.products = [];
        this.path = './src/Managers/productos.json';
    };

    validateCode = async (obj) => {
        let validateCode = this.products.find(property => property.code === Object.values(obj)[4]);
        if (validateCode !== undefined) return { status: 'error', message: `El producto: '${obj.title}',no fue añadido.Codigo repetido: '${obj.code}' existente` }
        return await this.addId(obj);
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
            return { status: 'success', message: `Producto añadido con Id: ${id}` };
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
            const result = await this.checkID(id)
            if (result.status === 'error') return result

            const product = products.find(product => product.id === id)
            return { product };
        }
        catch (err) {
            console.log(err);
            return { status: 'error', message: err.message };
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

            this.saveProducts(pid);
            return { status: 'success', message: 'Producto Actualizado' }
        }
        catch (err) {
            console.log(err);
            return { status: 'error', message: err.message };
        }
    }

    deleteProduct = async (id) => {

        try {
            const products = await this.checkId(id)
            if (result.status === 'error') return result

            this.products = products.filter(product => product.id !== id)

            this.saveProducts(id)
            return { status: 'success', message: `Producto de ID: ${id} eliminado` }
        }
        catch (err) {
            console.log(err);}
            return { status: 'error', message: err.message };
        }

    addProduct = async ({ title, description, price, code, stock, status, category, thumbnails }) => {
        try {
            this.products = await this.getProducts()

            if(price < 0 || stock < 0 ) return { status: 'error', message: 'Product and stock cannot be values less than or equal to zero' };
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

            

            const result = (Object.values(product).every(property => property))
            
            if (!result) return { status: 'error', message: 'Producto sin añadir' };
            
            if (!(typeof title === 'string' && 
                typeof description === 'string' && 
                typeof price === 'number' && 
                typeof code === 'string' && 
                typeof stock === 'number' && 
                typeof status === 'boolean' && 
                typeof category === 'string' && 
                Array.isArray(thumbnails))) 
                return { status: 'error', message:'Propiedad Invalida' }

            

            return this.validateCode(product)
        }
        catch (err) {
            console.log(err);
            return { status: 'error', message: err.message };
        }
    };
};

export default ProductManager;

