import nodemailer from 'nodemailer';

// 🎨 Plantilla maestra para estandarizar el diseño de todos los correos
const generarPlantillaEmail = (titulo, nombre, mensaje1, mensaje2, textoBoton, enlace) => {
    return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
            
            <div style="background-color: #4ade80; padding: 35px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
                    Bienes<span style="font-weight: 400; color: #000000;">Raíces</span>
                </h1>
            </div>
            
            <div style="padding: 40px 35px; color: #374151;">
                <h2 style="margin-top: 0; color: #111827; font-size: 24px; font-weight: 700;">${titulo}</h2>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Hola <strong>${nombre}</strong>,<br><br>
                    ${mensaje1}
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    ${mensaje2}
                </p>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${enlace}" style="background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 30px; font-weight: bold; font-size: 15px; text-transform: uppercase; display: inline-block; letter-spacing: 1px;">
                        ${textoBoton}
                    </a>
                </div>
                
                <p style="font-size: 13px; color: #9ca3af; text-align: center; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 25px;">
                    Si tú no realizaste esta acción o no creaste la cuenta, por favor ignora este correo.<br><br>
                    © ${new Date().getFullYear()} BienesRaices-240603. Todos los derechos reservados.
                </p>
            </div>
            
        </div>
    </div>
    `;
};

// 📧 1. Correo de Confirmación de Registro
const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, token } = datos;

    await transport.sendMail({
        from: 'BienesRaices-240603.com',
        to: email,
        subject: 'Bienvenid@ a la Plataforma de Bienes Raíces - Confirma tu cuenta',
        html: generarPlantillaEmail(
            '¡Bienvenido a Bienes Raíces! 🏡',
            nombre,
            'Tu cuenta ya está lista, nos alegra tenerte en nuestra plataforma.',
            'Solo debes confirmarla haciendo clic en el siguiente enlace:',
            'Confirmar Cuenta',
            `http://localhost:${process.env.PORT}/auth/confirma/${token}`
        )
    });
};

// 📧 2. Correo de Restauración de Contraseña
const emailResetearPassword = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, token } = datos;

    await transport.sendMail({
        from: 'BienesRaices-240603.com',
        to: email,
        subject: 'Solicitud de restauración de contraseña - BienesRaices-240603.com',
        html: generarPlantillaEmail(
            'Recupera tu Contraseña',
            nombre,
            'Hemos recibido tu solicitud para restaurar la contraseña de tu cuenta.',
            'Por favor, accede a la siguiente liga para realizar la actualización:',
            'Restablecer Contraseña',
            `http://localhost:${process.env.PORT}/auth/actualizarPassword/${token}`
        )
    });
};

// 📧 3. NUEVO: Correo de Cuenta Bloqueada
const emailCuentaBloqueada = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, token } = datos;

    await transport.sendMail({
        from: 'BienesRaices-240603.com',
        to: email,
        subject: '¡Alerta de Seguridad! Cuenta Bloqueada',
        html: generarPlantillaEmail(
            '¡Alerta de Seguridad! 🚨',
            nombre,
            'Hemos detectado múltiples intentos fallidos de inicio de sesión. Por tu seguridad, <strong>nuestro sistema ha bloqueado el acceso temporalmente</strong>.',
            'No te preocupes, si fuiste tú o simplemente olvidaste tu contraseña, puedes desbloquear tu cuenta haciendo clic en el siguiente botón:',
            'Desbloquear mi cuenta',
            `http://localhost:${process.env.PORT}/auth/desbloquear/${token}`
        )
    });
};

export { emailRegistro, emailResetearPassword, emailCuentaBloqueada };