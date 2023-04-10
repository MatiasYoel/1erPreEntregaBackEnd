const { promises: fs } = require('fs');

class ProductManager {

    constructor(path) {
        this.path = path;
    }
    //Metodo agregado de un Producto
    async addProduct({ title, description, price, thumbnail, code, stock }) {
        try {
        const products = await this.getProducts();
        products.forEach((prod) => {
            if (prod.code === code) {
            throw new Error("Existe previamente");
            }
        });
    
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
    
        product.id = 0;
        if (products.length > 0) {
            product.id = products[products.length - 1].id + 1;
        }
    
        products.push(product);

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
        console.log(error);
        }
    };    
    //Metodo obtener un Producto
    async getProducts() {
        try {
            const products = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        } catch (error) {
            return [];
        }
    }
    //Metodo obtener un Producto por Id
    async getProductById(id) {
        try {
        const products = await this.getProducts();
        let product = products.find((prod) => prod.id === id);
        if (!product) {
            throw new Error('Not found');
        }
        return product;
        } catch (error) {
            console.error(error);
        }
    }
    //Metodo actualizar un Producto 
    async updateProduct(id, updatedFields) {
        try {
        const products = await this.getProducts();
        const index = products.findIndex((prod) => prod.id === id);
        if (index === -1) {
            throw new Error('Not found');
        }
    
        const productToUpdate = { ...products[index], ...updatedFields };
    
        products[index] = productToUpdate;
    
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    
        return productToUpdate;
        } catch (error) {
        console.error(error);
        }
    }
    //Metodo borrar un Producto
    async deleteProduct(id) {
        try {
        const products = await this.getProducts();
        const index = products.findIndex((prod) => prod.id === id);
        if (index === -1) {
            throw new Error('Not found');
        }
        // Elimina el producto de la lista
        products.splice(index, 1);
        // Escribe la lista actualizada en el archivo
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
    console.error(error);
    }
    }
}
    //Metodo testea el ProductManagerNew
    const test = async () => {
        const productManagerNew = new ProductManager('./productos.json');
        console.log('Devuelve un arreglo vacio:', await productManagerNew.getProducts());
    await productManagerNew.addProduct({
        title: "Remera Deportiva",
        description: "Remera Deportiva para Hombre, diseñada y pensada para el desempeño en actividades fisicas de exigencia.",
        price: 4.000,
        thumbnail: "Proximamente tendremos esta imagen",
        code: "213Nd3Zl",
        stock: 5,
    });
    console.log('Producto Agregado', await productManagerNew.getProducts());
    console.log(await productManagerNew.getProductById(2));
    console.log('Producto con id 0: ',await productManagerNew.getProductById(0)
    );

    await productManagerNew.updateProduct(0, { title: 'Remera Deportiva Nueva Temporada' });
    console.log('Producto con id 0 y title actualizado: ', await productManagerNew.getProductById(0)
    );

    await productManagerNew.deleteProduct(0);
    console.log('Borro el producto y me devuelve el arreglo vacio:', await productManagerNew.getProducts());
};

test();
