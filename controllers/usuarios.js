const { request, response } = require('express');

const usuariosGet = (req = request, res = response) => {
    const { q, nombre = 'No Name', apikey, page = '1', limit } = req.query;

    res.json({
        ok: true,
        msg: 'get API - controlador',
        q: q,
        nombre: nombre,
        apikey: apikey,
        page: page,
        limit: limit
    });
};

const usuariosPost = (req = request, res = response) => {
    const { nombre, edad } = req.body;

    res.json({
        ok: true,
        msg: 'post API - controlador',
        nombre,
        edad
    });
};

const usuariosPut = (req = request, res = response) => {
    const id = req.params.id;

    res.json({
        ok: true,
        msg: 'put API - controlador',
        id: id
    });
};

const usuariosDelete = (req = request, res = response) => {
    res.json({
        ok: true,
        msg: 'delete API - controlador'
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