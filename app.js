// ---------------- IMPORTATIONS GÉNÉRALES ---------------------- // 

// Importation d'Express
const express = require('express'); 

// Importation de Path pour accéder au path de notre serveur
const path = require('path'); 

// Importation du plugin Mongoose pour se connecter à la base de données
const mongoose = require('mongoose');

// Importation de Cors (pour éviter erreur CORS)
const cors = require('cors');



// ----------------- IMPORTATIONS SÉCURITÉ ---------------------- //

// Importation du plugin mongo-sanitize pour se protéger des injections SQL
const mongoSanitize = require('express-mongo-sanitize');

// Importation du plugin helmet pour sécuriser les en-têtes HTTP
const helmet = require("helmet");

// Importation de express-rate-limit pour prévenir les attaques par force brute (envoi d'un flux infini de requêtes à une API)
const rateLimit = require("express-rate-limit");

// Limitation du nombre de connexions d'un seul utilisateur (en lien avec rateLimit)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // à 15 minutes
  max: 100 // et chaque adresse IP est limitée à 100 requêtes
});



// ----------------- CONNEXION MONGO DB ---------------------- //

// Utilisation de variables d'environnement pour récupérer les informations confidentielles (localisées dans fichier .env)
require('dotenv').config();

// Connexion à la base de données mongoDB 
mongoose.connect(process.env.MONGO_DB,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



// ----------------- IMPORTATIONS ROUTEURS ---------------------- //

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');



// ----------------------- MIDDLEWARES --------------------------- //
// app.use = Applique le middleware à toutes les requêtes

// Fonction permettant d'appeler la fonction express (créer une application Express)
const app = express();

// Middleware global remplaçant body-parser (méthode de body-parser pour transformer le corps de la requête en JSON / objet JS utilisable)
app.use(express.json());

// Message s'affichant dans la console quand une requête est reçue
app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
});

// Middleware général appliqué à toute les réquêtes et réponses
// Headers permettent d'accéder : à notre API depuis n'importe quelle origine ( '*' )
// d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.)
// d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Middleware global pour éviter erreur CORS
app.use(cors());


// POUR LA SÉCURITÉ

app.use(mongoSanitize()); // Middleware global pour se protéger des injections SQL
app.use(helmet()); // Middleware pour sécuriser les en-têtes HTTP
app.disable('x-powered-by'); // Désactivation de l’en-tête 'X-Powered-By' pour empêcher les intrus de l'utiliser (en-tête activé par défaut)
app.use(limiter); // Middleware pour prévenir les attaques par force brute

// Middleware pour la gestion de l'enregistrement des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware servant à utiliser les routes 'Utilisateur' et 'Sauces'
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);



// ----------------------- EXPORTATIONS --------------------------- //

// Exporter cette application pour pouvoir y accéder depuis d'autres fichiers du projet (serveur Node)
module.exports = app;