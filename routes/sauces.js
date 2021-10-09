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
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/:id/like', auth, saucesCtrl.likeOrDislikeSauce);


module.exports = router;