import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ajusta esta ruta si tu archivo db.js está en otra carpeta
import bcrypt from 'bcrypt'; // Asegúrate de tener instalado bcrypt (npm i bcrypt)

const Usuario = sequelize.define('Usuario', { // <-- 1. CORREGIDO: Era sequelize.define, no BroadcastChannel
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true, // <-- 2. CORREGIDO: La "K" debe ser mayúscula
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre no puede estar vacio' // <-- 3. CORREGIDO: Decía "La contraseña" por copiar y pegar
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            msg: 'El email ya esta registrado'
        },
        validate: {
            isEmail: {
                msg: 'Debe proporcionar un email valido'
            },
            notEmpty: {
                msg: 'El email no puede estar vacio'
            }
        }
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña no puede estar vacia'
            },
            len: {
                args: [8,100],
                msg: 'La contraseña debe tener al menos 8 caracteres' // <-- Ajusté el texto para que coincida con el [8, 100]
            }
        }
    },
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'confirmado'
    },
    tokenRecuperacion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'token_recuperacion'
    },
    tokenExpiracion: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'token_expiracion'
    },
    regStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'reg_status'
    },
    ultimoAcceso: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'ultimo_acceso'
    }
}, {
    tableName: 'tb_usuarios', // <-- 4. CORREGIDO: Decía "tableNme"
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    hooks: { // <-- 5. CORREGIDO: Decía "hocks"
        // Hash de contraseña antes de crear
        beforeCreate: async(usuario) => {
            if (usuario.password) {
                const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },

        // Hash de contraseña antes de actualizar (si cambió)
        beforeUpdate: async (usuario) => {
            if (usuario.changed('password')) {
                const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
    }
});

// 6. CORREGIDO: Faltaba exportar el modelo para poder usarlo en tus controladores
export default Usuario;