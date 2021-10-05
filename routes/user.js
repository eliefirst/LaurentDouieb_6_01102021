// ---------------- IMPORTATIONS GÉNÉRALES ---------------------- // 

// Importation de l'infrastructure d'application Web Node.js
const express = require('express');

// Création du routeur
const router = express.Router();

// Importation du controlleur 'user'
const userCtrl = require('../controllers/user');

// Importation du middleware 'password
const passCtrl = require("../middleware/password-validation")



// ---------------- ROUTES UTILISATEUR ---------------------- // 

// Les routes utilisent la méthode POST pour les fonctions 'signup' et 'login'
router.post('/signup', passCtrl, userCtrl.signup);
router.post('/login', passCtrl, userCtrl.login);



// ---------------- EXPORTATIONS ---------------------- // 

// Exportation des routeurs 
module.exports = router;