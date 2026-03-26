import jwt from 'jsonwebtoken';

const generarToken = () => Date.now().toString(32) + Math.random().toString(32).substring(2) + "^JIlc-16";

const generarJWT = id => jwt.sign({
    id,
    nombre: 'Jonathan Isai Leal Cruz',
    programaEducativo: 'DSM',
    asignatura: 'Aplicaciones Web Orientadas a Servicios',
    tecnologias: 'API REST, NodeJS, Express y Sequelize',
}, process.env.JWT_SECRET, { expiresIn: '1d' });

export { generarToken, generarJWT };