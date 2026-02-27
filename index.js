import express from "express";
import usuarioRoutes from './routes/usuariorouter.js';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import db from './config/db.js'; // 1. Importamos tu conexión

// 2. IMPORTANTE: Importamos el modelo aquí para que Sequelize sepa que existe ANTES de sincronizar
import Usuario from './models/Usuario.js'; // Asegúrate de que la ruta sea correcta según tus carpetas

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use("/auth", usuarioRoutes);

// 3. Conectamos y Sincronizamos la base de datos
try {
    await connectDB(); // Conecta a MySQL
    
    // El método sync() lee los modelos importados y CREA las tablas que falten
    await db.sync(); 
    console.log("¡Tabla sincronizada correctamente en la base de datos!");
    
} catch (error) {
    console.error("Error al conectar o sincronizar la BD:", error);
}

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, ()=> {
    console.log(`El servidor está iniciado en el puerto ${PORT}`)
});