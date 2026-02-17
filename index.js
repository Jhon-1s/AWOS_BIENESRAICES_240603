import express from "express";
import usuarioRoutes from './routes/usuariorouter.js'

// Instanciamos el servidor que alojara la webapp
const app = express();

// Habilitamos pug
app.set('view engine', 'pug');
app.set('views', './views')

// Definimos la carpeta de los recursos estáticos
app.use(express.static('public'))
// Importamos sus rutas (ruteo)
app.use("/auth",usuarioRoutes)

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, ()=> {
    console.log(`El servidor esta iniciado en el puerto ${PORT}`)
}) 


//import usuarioRoutes from './routes/usuariorouter.js'