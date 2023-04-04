
class ProductManager {

    constructor() {
        this.products = [];
    };
    addProducts = ({ title, description, price, thumbnail, code, stock }) => {

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los parametros son obligarios!")
            return;
        }
        
        const existCode = this.products.find(e => e.code === code);
        if (existCode) {
            console.log("Existe previamente")
            return;
        }

        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        const id = this.products.length

        if (id === 0) {
            product.id = 1
        } {
            product.id = id + 1
        }

        this.products.push(product)
    };

    getProducts = () => {
        console.log(this.products)
    }

    getProductById = (productId) => {

        if (!productId) {
            console.log("Ingrese un ID de búsqueda")
            return;
        }

        const findId = this.products.find(e => e.id === productId);
        if (!findId) {
            console.log("No encontrado")
            return;
        }

        console.log(this.products[productId - 1])
    }
};

const newProduct = new ProductManager()

const productItem = {
    title: "Remera Deportiva",
    description: "Remera Deportiva para Hombre, diseñada y pensada para el desempeño en actividades fisicas de exigencia.",
    price: 4.000,
    thumbnail: "Proximamente tendremos esta imagen",
    code: "213Nd3Zl",
    stock: 5
}

newProduct.getProducts()
newProduct.addProducts(productItem.title)
newProduct.addProducts(productItem)
newProduct.getProducts()
newProduct.addProducts(productItem)
newProduct.getProductById()
newProduct.getProductById(1)
newProduct.getProductById(2)