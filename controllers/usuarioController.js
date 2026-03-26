import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generarToken, generarJWT } from '../lib/tokens.js';
import { emailRegistro, emailResetearPassword } from '../lib/emails.js';

const formularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "Inicia sesión",
        csrfToken: req.csrfToken()
    });
};

const formularioRegistro = (req, res) => {
    res.render("auth/registro", { pagina: "Registrate con nosotros :)" });
};

const registrarUsuario = async (req, res) => {
    const { nombreUsuario: name, emailUsuario: email, passwordUsuario: password } = req.body;

    // Validación de los datos
    await check('nombreUsuario').notEmpty().withMessage("El nombre de la persona no puede ser vacío").run(req);
    await check('emailUsuario').notEmpty().withMessage("El correo electrónico no puede ser vacío").isEmail().withMessage("El correo electrónico no tiene un formato adecuado").run(req);
    await check('passwordUsuario').notEmpty().withMessage("La contraseña parece estar vacía").isLength({ min: 8, max: 30 }).withMessage("La longitud de la contraseña debe ser entre 8 y 30 caractéres").run(req);
    await check('confirmacionUsuario').equals(password).withMessage("Ambas contraseñas deben ser iguales").run(req);

    let resultadoValidacion = validationResult(req);

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
        return res.render("auth/registro", {
            pagina: "Registrate con nosotros :)",
            errores: [{ msg: `Ya existe un usuario asociado al correo: ${email}` }],
            usuario: { nombreUsuario: name, emailUsuario: email }
        });
    }

    if (resultadoValidacion.isEmpty()) {
        const data = {
            name,
            email,
            password,
            token: generarToken()
        };
        const usuario = await Usuario.create(data);

        // Enviar el correo electrónico
        emailRegistro({
            nombre: usuario.name,
            email: usuario.email,
            token: usuario.token
        });

        res.render("templates/mensaje", {
            title: "¡Bienvenid@ a BienesRaíces!",
            msg: `La cuenta asociada al correo: ${email}, se ha creado exitosamente, te pedimos confirmar tu cuenta a través del correo electrónico que te hemos enviado.`
        });
    } else {
        res.render("auth/registro", {
            pagina: "Error al intentar crear una cuenta.",
            errores: resultadoValidacion.array(),
            usuario: { nombreUsuario: name, emailUsuario: email }
        });
    }
};

const paginaConfirmacion = async (req, res) => {
    const { token: tokenCuenta } = req.params;

    const usuarioToken = await Usuario.findOne({ where: { token: tokenCuenta } });

    if (!usuarioToken) {
        res.render("templates/mensaje", {
            title: "Error al confirmar la cuenta",
            msg: `El código de verificación (no es válido), por favor intentalo de nuevo.`,
            buttonVisibility: false
        });
    } else {
        usuarioToken.token = null;
        usuarioToken.confirmed = true;
        await usuarioToken.save();

        res.render("templates/mensaje", {
            title: "Confirmación exitosa",
            msg: `La cuenta de: ${usuarioToken.name}, asociada al correo electrónico: ${usuarioToken.email} se ha confirmado, ahora ya puedes ingresar a la plataforma.`,
            buttonVisibility: true,
            buttonText: "Ingresar a BienesRaices",
            buttonURL: "/auth/login"
        });
    }
};

const formularioRecuperacion = (req, res) => {
    res.render("auth/recuperarPassword", { pagina: "Te ayudamos a restaurar tu contraseña" });
};

const resetearPassword = async (req, res) => {
    const { emailUsuario: email } = req.body;

    await check('emailUsuario')
        .notEmpty().withMessage("El correo electrónico no puede estar vacío")
        .isEmail().withMessage("El correo electrónico no tiene un formato adecuado")
        .run(req);

    let resultadoValidacion = validationResult(req);

    if (!resultadoValidacion.isEmpty()) {
        return res.render("auth/recuperarPassword", {
            pagina: "Error, correo inválido",
            errores: resultadoValidacion.array(),
            usuario: { emailUsuario: email }
        });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        return res.render("auth/recuperarPassword", {
            pagina: "Recuperar Contraseña",
            errores: [{ msg: `No se ha encontrado ninguna cuenta asociada al correo: ${email}` }]
        });
    }

    if (!usuario.confirmed) {
        return res.render("auth/recuperarPassword", {
            pagina: "Recuperar Contraseña",
            errores: [{ msg: `La cuenta asociada a ${email} no ha sido confirmada. Revisa tu bandeja de entrada.` }]
        });
    }

    try {
        usuario.token = generarToken();
        await usuario.save();

        emailResetearPassword({
            nombre: usuario.name,
            email: usuario.email,
            token: usuario.token
        });

        return res.render("templates/mensaje", {
            title: "Correo Enviado",
            msg: `Un paso más, te hemos enviado un correo electrónico con la liga segura para la restauración de tu contraseña.`,
            buttonVisibility: false
        });
    } catch (error) {
        return res.render("auth/recuperarPassword", {
            pagina: "Error Interno",
            errores: [{ msg: "Ocurrió un error al enviar el correo. Inténtalo más tarde." }]
        });
    }
};

const formularioActualizacionPassword = async (req, res) => {
    const { token } = req.params;
    const usuarioSolicitante = await Usuario.findOne({ where: { token } });

    res.render("auth/resetearPassword", {
        pagina: "Ingresa tu nueva contraseña",
        email: usuarioSolicitante.email
    });
};

const actualizarPassword = async (req, res) => {
    const { emailSolicitante: email, passwordUsuario: password } = req.body;

    await check('passwordUsuario').notEmpty().withMessage("La contraseña parece estar vacía").isLength({ min: 8, max: 30 }).withMessage("La longitud de la contraseña debe ser entre 8 y 30 caractéres").run(req);
    await check('confirmacionUsuario').equals(password).withMessage("Ambas contraseñas deben ser iguales").run(req);

    let resultadoValidacion = validationResult(req);

    if (!resultadoValidacion.isEmpty()) {
        res.render("auth/resetearPassword", {
            pagina: "Error al intentar actualizar la contraseña",
            errores: resultadoValidacion.array()
        });
    }
    // TODO: Falta la lógica para guardar la nueva contraseña en la BD
};

const autenticar = async (req, res) => {
    await check('emailUsuario').isEmail().withMessage('El email es obligatorio').run(req);
    await check('passwordUsuario').notEmpty().withMessage('El password es obligatorio').run(req);

    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        return res.render("auth/login", {
            pagina: "Inicia sesión",
            errores: resultado.array()
        });
    }

    const { emailUsuario: email, passwordUsuario: password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        return res.render("auth/login", {
            pagina: "Inicia sesión",
            csrfToken: req.csrfToken(),
            errores: [{ msg: "El usuario no existe" }]
        });
    }

    if (!usuario.confirmed) {
        return res.render("auth/login", {
            pagina: "Inicia sesión",
            errores: [{ msg: "Tu cuenta no ha sido confirmada. Revisa tu correo." }]
        });
    }

    if (usuario.bloqueado) {
        return res.render("auth/login", {
            pagina: "Inicia sesión",
            errores: [{ msg: "Tu cuenta está BLOQUEADA por exceso de intentos fallidos. Revisa tu correo para desbloquearla." }]
        });
    }

    const passwordCorrecto = await usuario.validarPassword(password);

    if (!passwordCorrecto) {
        usuario.intentosFallidos += 1;
        if (usuario.intentosFallidos >= 5) {
            usuario.bloqueado = true;
            await usuario.save();

            return res.render("auth/login", {
                pagina: "Inicia sesión",
                errores: [{ msg: "Has superado los 5 intentos. Tu cuenta ha sido BLOQUEADA." }]
            });
        }
        await usuario.save();
        return res.render("auth/login", {
            pagina: "Inicia sesión",
            errores: [{ msg: `El Password es incorrecto. Intento ${usuario.intentosFallidos} de 5.` }]
        });
    }

    // Si el password es correcto, reseteamos los intentos y entramos
    usuario.intentosFallidos = 0;
    await usuario.save();

    return res.redirect('/mis-propiedades');
};
const callbackOAuth = (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    const usuario = req.user;

    const token = generarJWT({ 
        id: usuario.id, 
        nombre: usuario.name, 
        email: usuario.email 
    });

    return res.cookie('_token', token, {
        httpOnly: true,
        sameSite: 'strict'
    }).redirect('/mis-propiedades');
};

export {
    formularioLogin,formularioRegistro,registrarUsuario,formularioRecuperacion,paginaConfirmacion,resetearPassword,formularioActualizacionPassword,actualizarPassword,callbackOAuth,autenticar};