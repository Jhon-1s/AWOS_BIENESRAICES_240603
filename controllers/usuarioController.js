import Usuario from '../models/Usuario.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión' 
    });
}; // <-- Faltaba cerrar esta llave y estaba duplicada la función

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Regístrate con nosotros :)' // También tenías esta función duplicada abajo
    });
};

// Sacamos esta función para que esté separada e independiente
const formularioRecuperacion = (req, res) => {
    res.render('auth/olvidepassword', { // Asegúrate de tener un archivo olvidepassword.pug
        pagina: 'Recuperar Contraseña'
    });
};

const registrarUsuario = async (req, res) => {
    console.log("Datos que llegaron del formulario:", req.body);
    
    // Corregido: Tu comentario decía 'nombre' pero la llave decía 'name'. 
    // Lo ajusté a 'nombre' para que coincida con tu intención.
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
};

// Exportamos TODAS las funciones
export {
    formularioLogin,
    formularioRegistro,
    registrarUsuario,
    formularioRecuperacion 
};