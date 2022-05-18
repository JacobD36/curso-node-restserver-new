const { request, response } = require('express');
const { Categoria } = require('../models');

//Obtiene el resultado paginado de las categorías
const obtenerCategorias = async(req = request, res = response) => {
    const { limite = 10, page = 1 } = req.query;
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments().where(query),
        Categoria.find().populate('usuario', 'nombre').skip(Number((page - 1) * Number(limite))).limit(Number(limite)).where(query)
    ]);

    res.json({
        total,
        categorias
    });
};

const obtenerCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    res.json(categoria);
}

//Crea una nueva categoría en la BD
const crearCategoria = async(req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar en BD
    await categoria.save();

    res.status(201).json({
        data
    });
}

const actualizaCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json({ categoria });
}

const borrarCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(categoriaBorrada);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizaCategoria,
    borrarCategoria
}