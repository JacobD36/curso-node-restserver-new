const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la Base de Datos`);
    }
};

const emailExiste = async(correo = '') => {
    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya se encuentra registrado`);
    }
}

const existeUsuarioID = async(id) => {
    //Verificar si el id de usuario existe
    const existeID = await Usuario.findById(id);
    if (!existeID) {
        throw new Error(`El ID ${id} no existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioID
}