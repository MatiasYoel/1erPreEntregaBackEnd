import express from 'express';
import productsRouter from './routers/products.routes.js';
import cartRouter from './routers/carts.routes.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true})); 

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)


app.listen(8080, () => {
    console.log(`listening on PORT 8080`)
})