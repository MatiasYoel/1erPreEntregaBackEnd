import mongoose from 'mongoose';

const url = 'mongodb+srv://fernandezmatiasyoel:VaULHrb41H2K9fje@cluster0.3aqi2wj.mongodb.net/?retryWrites=true&w=majority'


const connectToDB = () => {
    try {
        mongoose.connect(url)
        console.log('Connected DB')
    } catch (error) {
        console.log(error);
    }
};

export default connectToDB

