function manejarErrores(error, req, res, next) {

    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({
            mensaje: 'El JSON enviado no es válido'
        });
    }

    console.error(error);

    res.status(500).json({
        mensaje: 'Ocurrió un error en el servidor'
    });
}

module.exports = manejarErrores;