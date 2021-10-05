// ---------------- IMPORTATIONS GÉNÉRALES ---------------------- // 

// Importation de l'infrastructure d'application Web Node.js
const express = require('express');

// Création du routeur
const router = express.Router();

// Importation du Middleware d'authentification
const auth = require('../middleware/auth')
// Importation du Middleware de configuration de multer
const multer = require('../middleware/multer-config')

// Importation du controlleur 'sauces'
const saucesCtrl = require('../controllers/sauces');



// ---------------- ROUTES DES SAUCES ---------------------- // 

// Route utilisant la méthode POST pour ajouter une sauce (utilisation du controlleur 'createSauce')
router.post('/', auth, multer, saucesCtrl.createSauce);

// Route utilisant la méthode PUT pour modifier une sauce existante (utilisation du controlleur 'modifySauce')
router.put ('/:id', auth, multer, saucesCtrl.modifySauce);

// Route utilisant la méthode DELETE pour supprimer une sauce existante (utilisation du controlleur 'deleteSauce')
router.delete('/:id', auth, saucesCtrl.deleteSauce );

// Route utilisant la méthode GET pour récupérer une sauce avec son identifiant (utilisation du controlleur 'getOneSauce')
// ':' indique que la route est dynamique
router.get('/:id', auth, saucesCtrl.getOneSauce );

// Route utilisant la méthode GET pour récupérer toutes les sauces (utilisation du controlleur 'getAllSauces')
router.get('/', auth, saucesCtrl.getAllSauces);

// Route utilisant la méthode POST pour liker ou disliker une sauce avec son identifiant (utilisation du controlleur 'likeOrDislikeSauce')
router.post('/:id/like', auth, saucesCtrl.likeOrDislikeSauce);



// ---------------- EXPORTATIONS ---------------------- // 

// Exportation des routeurs
module.exports = router;