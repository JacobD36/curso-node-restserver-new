const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {
    //const { q, nombre = 'No Name', apikey, page = '1', limit } = req.query;
    const { limite = 10, page = 1 } = req.query;
    const query = { estado: true }

    //const usuarios = await Usuario.find().skip(Number((page - 1) * Number(limite))).limit(Number(limite)).where(query);

    //const total = await Usuario.countDocuments().where(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments().where(query),
        Usuario.find().skip(Number((page - 1) * Number(limite))).limit(Number(limite)).where(query)
    ]);

    res.json({
        total,
        usuarios
    });
};

const usuariosPost = async(req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    //const {google, ...resto} = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(usuario.password, salt);

    //Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
};

const usuariosPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    });
};

const usuariosDelete = async(req = request, res = response) => {
    const { id } = req.params;

    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        usuario
    });
};

const usuariosPatch = (req = request, res = response) => {
    res.json({
        ok: true,
        msg: 'patch API - controlador'
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}