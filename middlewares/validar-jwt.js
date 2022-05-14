const { request, response } = require('express');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No se encontró el token'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponda al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario inexistente'
            });
        }

        //Verificar si el uid tiene estado true
        if (!usuario.estado) {
            return req.status(401).json({
                msg: 'Usuario inhabilitado'
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validarJWT
}