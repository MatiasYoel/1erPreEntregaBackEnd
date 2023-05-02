import express from 'express';
import productsRouter from './routers/products.routes.js';
import cartRouter from './routers/carts.routes.js';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewRouter from './routers/views.router.js'
import { Server } from 'socket.io';
import socketProducts from './utils.socket.js';

const app = express();
const PORT = 8081

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({extended:true})); 

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewRouter);

const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}`);
        console.log("http://localhost:8081/")
        console.log("http://localhost:8081/realtimeproducts");
    }
    catch (err) {
        console.log(err);
    }
});

const socketServer = new Server(httpServer)

socketProducts(socketServer)