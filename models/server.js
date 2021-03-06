const express = require("express");
const cors = require('cors');
const fileupload = require('express-fileupload');
const { dbConnection } = require("../database/config");
const { socketController } = require("../sockets/socketController");
require('dotenv').config();

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            productos: '/api/productos',
            categorias: '/api/categorias',
            buscar: '/api/buscar',
            uploads: '/api/uploads'
        }

        this.categoriasPath = '/api/categorias';

        //Conectar a Base de Datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas
        this.routes();

        //Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());
        //Parseo y lectura del body
        this.app.use(express.json());
        //Directorio público
        this.app.use(express.static('public'));
        //Fileupload - carga de archivos
        this.app.use(fileupload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets() {
        this.io.on("connection", (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;