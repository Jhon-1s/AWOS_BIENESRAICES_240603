import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import Usuario from '../models/Usuario.js';
import dotenv from 'dotenv';
dotenv.config();

// Configurar cómo se guarda el usuario en la sesión
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await Usuario.findByPk(id);
    done(null, user);
});

// Función auxiliar para generar contraseñas aleatorias (ya que la BD exige una)
const generarPasswordRandom = () => Math.random().toString(36).slice(-10) + "Aa1!";

// ========================
// ESTRATEGIA GOOGLE
// ========================
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            // Si no existe, lo creamos y lo autoconfirmamos
            usuario = await Usuario.create({
                name: profile.displayName,
                email: email,
                password: generarPasswordRandom(),
                confirmed: true, // Automáticamente confirmado porque viene de Google
                token: null
            });
        }
        return done(null, usuario);
    } catch (error) {
        return done(error, null);
    }
}));

// ========================
// ESTRATEGIA X (Twitter)
// ========================
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/x/callback",
    includeEmail: true // Vital para intentar obtener el correo
}, async (token, tokenSecret, profile, done) => {
    try {
        // Twitter a veces no da el email, usamos un fallback por si acaso
        const email = (profile.emails && profile.emails.length > 0) 
            ? profile.emails[0].value 
            : `${profile.username}@twitter-user.com`; 

        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            usuario = await Usuario.create({
                name: profile.displayName || profile.username,
                email: email,
                password: generarPasswordRandom(),
                confirmed: true,
                token: null
            });
        }
        return done(null, usuario);
    } catch (error) {
        return done(error, null);
    }
}));

export default passport;