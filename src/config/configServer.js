import mongoose from 'mongoose';
import config from './config.js';
const url = config.mongoUrl


const connectToDB = () => {
    try {
        mongoose.connect(url)
        console.log('Conectado a la Base de Datos')
    } catch (error) {
        console.log(error);
    }
};

export default connectToDB

