const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, obtenerProductoPorId, actualizaProducto, crearProducto, borraProducto } = require('../controllers/productos');
const { existeCategoria, existeProducto } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares');
const router = Router();

/**
 * {{url}}/api/productos
 */

router.get('/', obtenerProductos);
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProductoPorId);
router.put('/:id', [
    validarJWT,
    check('categoria', 'No es un id de categoría válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], actualizaProducto);
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('categoria', 'No es un id válido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto);
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borraProducto);

module.exports = router;