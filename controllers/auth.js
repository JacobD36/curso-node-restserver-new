const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/genJWT');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req = request, res = response) => {
    const { correo, password } = req.body;

    try {
        //Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario no encontrado'
            });
        }

        //Si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario se encuentra inactivo'
            });
        }

        //Verificar la contraseña
        const validaPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validaPassword) {
            return res.status(400).json({
                msg: 'Password incorrecto'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const googleSignIn = async(req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { correo, nombre, img } = await googleVerify(id_token);

        //Se verifica que el correo exista en la base de datos
        let usuario = await Usuario.findOne({ correo });

        //Si el correo no existe se crea la cuenta
        if (!usuario) {
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            }

            usuario = new Usuario(data);
            usuario.save();
        }

        //Se verifica el estado del usuario en la BD
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Comuníquese con el Administrador. Su usuario está inactivo'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        return res.status(400).json({
            msg: 'El token de Google no se pudo verificar'
        });
    }
}

module.exports = {
    login,
    googleSignIn
}