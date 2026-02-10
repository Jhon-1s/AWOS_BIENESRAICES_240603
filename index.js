import express from "express";
import usuarioRouter from "./routes/usuariorouter.js";

const app = express();

app.use("/", usuarioRouter); // ✅ correcto

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, ()=> {
    console.log(`El servidor esta iniciado en el puerto ${PORT}`)
});
