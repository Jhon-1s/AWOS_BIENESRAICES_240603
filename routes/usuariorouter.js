import express from 'express'
// Agregamos formularioRecuperacion a la lista de importación
import { formularioLogin, formularioRegistro, registrarUsuario, formularioRecuperacion } from '../controllers/usuarioController.js';

const router = express.Router();
router.get("/login", formularioLogin)
router.get("/registro", formularioRegistro)
router.post("/registro", registrarUsuario)
router.get("/olvidepassword", formularioRecuperacion);

//post

//Definimos las rutas
// Ejemplo de un ENDPOINT GET
router.get("/", (req, res) => {
    console.log("Bienvenid@ al Sistema de Bienes Raices")
    console.log("Procesando una petición del tipo GET");
    res.json({
        status:200, 
        message: "Solicitud recibida a través del método GET"
    })
})

// Ejemplo de un ENDPOINT POST
router.post("/", (req,res) => {
    console.log("Procesando una petición del tipo POST");
    res.json({
        status:400, 
        message: "Lo sentimos, no se aceptan peticiones POST."
    })
})


// Ejemplo de un ENDPOINT POST  - Simular la creación de un nuevo usuario
router.post("/createUser", (req,res)=>{
    console.log("Procesando una petición del tipo POST");
    console.log("Se ha solicitado crear un nuevo usuario.")
    const nuevoUsuario = 
    {
        nombre: "Jonathan Leal",
        correo: "jonathan.leal@gmail.com"
    }
    res.json({
        status:200, 
        message: `Se ha solicitado la creación de un usuario de nombre: ${nuevoUsuario.nombre} y correo: ${nuevoUsuario.correo}`
    })
})


// Ejemplo de un ENDPOINT PUT - Simular la actualización de los datos de un usuario creado
router.put("/updateUser", (req, res) =>
{
    console.log("Procesando una petición del tipo PUT");
    console.log("Se ha solicitao la actualización de los datos del usuario, siendo PUT una actualización completa.")
    const usuario = 
    {
        nombre: "Jonathan I. Leal",
        correo: "jonathan.leal@gmail.com"
    }

    const usuarioActualizado =
    {
        nombre: "Fernando Ojeda",
        correo: "fer.ojeda@gmail.com"
    }
    res.json({
        status:200, 
        message: `Se ha solicitado la actualización completa de los datos del usuario de nombre: ${usuario.nombre} y correo: ${usuario.correo} a  
        ${usuarioActualizado.nombre} y correo: ${usuarioActualizado.correo}`
    })

})


// Ejemplo de un ENDPOINT  PATCH - Simular la actualización una contraseña del usuario
router.patch("/updatePassword/:nuevoPassword", (req, res) =>
{
    console.log("Procesando una petición del tipo PATCH");
    const usuario = 
    {
        nombre: "Jonathan Leal",
        correo: "jonathan.leal@gmail.com",
        password: "abcde"
    }

    const {nuevoPassword}= req.params

    res.json({
        status:200, 
        message: `Se ha solicitado la actualización parcial de la contraseña del usuario nombre: ${usuario.nombre} y correo: ${usuario.correo} del password: ${usuario.password} a  ${nuevoPassword}`
    })

})

// Ejemplo de un ENDPOINT del tipo DELETE
router.delete("/deleteProperty/:id", (req, res)=>
    {
        console.log("Procesando una petición del tipo DELETE");
        const {id} = req.params;

        res.json({
            status:200, 
            message: `Se realizará la eliminación de la propiedad: ${id}`
        })


    })



router.get("/saludo/:nombre", (req, res)=>
    {
        const {nombre} = req.params;
        console.log(`El usuario: ${nombre}`)
        res.status(200).send(`<p>Bienvenido <b>${nombre}</b></p> </h1`)       
    })


export default router