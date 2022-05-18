const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const { Producto } = require('../models');

const obtenerProductos = async(req = request, res = response) => {
    const { limite = 10, page = 1 } = req.query;
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments().where(query),
        Producto.find().populate('usuario', 'nombre').populate('categoria', 'nombre').skip(Number((page - 1) * Number(limite))).limit(Number(limite)).where(query)
    ]);

    res.json({
        total,
        productos
    });
};

const obtenerProductoPorId = async(req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    res.json(producto);
};

const crearProducto = async(req = request, res = response) => {
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El prodcuto ${productoDB.nombre} ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    //Generar la data a guardar
    const producto = new Producto(data);

    //Guardar en BD
    await producto.save();

    res.status(201).json({
        data
    });
};

const actualizaProducto = async(req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuarioo, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);
};

const borraProducto = async(req = request, res = response) => {
    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(productoBorrado);
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizaProducto,
    borraProducto
}