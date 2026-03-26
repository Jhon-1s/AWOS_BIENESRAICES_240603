const admin = (req, res) => {
    res.render('main/mis-propiedades', {
        pagina: 'Mis Propiedades'
    });
};

export {
    admin
};