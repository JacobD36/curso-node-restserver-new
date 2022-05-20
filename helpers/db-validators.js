const { Role, Usuario, Categoria, Producto } = require('../models');

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

const existeCategoria = async(id) => {
    //Verificar si el id de Categoría existe
    const existeID = await Categoria.findById(id);
    if (!existeID) {
        throw new Error(`La categoría con id: ${id} no existe`);
    }
}

const existeProducto = async(id) => {
    //Verificar si el id de Producto existe
    const existeID = await Producto.findById(id);
    if (!existeID) {
        throw new Error(`El producto con id: ${id} no existe`);
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    //Validar colecciones permitidas
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La colección ${coleccion} no está incluída en ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioID,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}