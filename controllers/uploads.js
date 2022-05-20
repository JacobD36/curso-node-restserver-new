const { request, response } = require("express");
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');
const path = require('path');
const fs = require('fs');

const cargarArchivo = async(req = request, res = response) => {
    try {
        //Imagenes
        const nombre = await subirArchivo(req.files);

        res.json({
            nombre
        });
    } catch (error) {
        res.status(400).json({ error });
    }
}

//req y res son requeridos. next() es sólo para middlewares
const actualizarImagen = async(req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    try {
        //Limpiar imágenes previas
        if (modelo.img) {
            //Prueba de borrado de la imágen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        //Imagenes
        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;

        await modelo.save();

        res.json(modelo);
    } catch (error) {
        res.status(400).json({ error });
    }
}

module.exports = {
    cargarArchivo,
    actualizarImagen
}