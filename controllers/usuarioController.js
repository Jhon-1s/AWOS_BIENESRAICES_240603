import Usuario from '../models/Usuario.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión' 
    });
const formularioLogin = (req, res) =>{
    res.render('auth/login',{
    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Registrate con nosotros :)'
    });
}

// Sacamos esta función para que esté separada e independiente
const formularioRecuperacion = (req, res) => {
    res.render('auth/olvidepassword', { // Asegúrate de tener un archivo olvidepassword.pug
        pagina: 'Recuperar Contraseña'
    });
}

const registrarUsuario = async (req, res) => {
    console.log("Datos que llegaron del formulario:", req.body);
    
    // Corregido: 'nombre' en lugar de 'name'
    const data = {
        name: req.body.nombreUsuario, 
        email: req.body.emailUsuario,
        password: req.body.passwordUsuario
    };

    try {
        const usuario = await Usuario.create(data);
        res.json(usuario); 
    } catch (error) {
        console.error("❌ ERROR AL GUARDAR EN LA BASE DE DATOS:", error);
        res.status(500).json({ error: "Hubo un error al intentar guardar el usuario" });
    }
}

// Exportamos TODAS las funciones
const formularioRegistro = (req, res) =>{
    res.render('auth/registro',{x
    })
}

export {
    formularioLogin,
    formularioRegistro,
    registrarUsuario,
    formularioRecuperacion // <-- Le quitamos las // para que se exporte
}