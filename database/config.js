const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN);

        console.log('Base de datos Online');
    } catch (error) {
        throw new Error('Error de conexión a la base de datos');
    }
};

module.exports = {
    dbConnection
};