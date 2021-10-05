// Importation de Mongoose permettant la création de schéma de données
const mongoose = require('mongoose');

// Création d'un schéma de données pour les sauces (utilisation dans les fonctions dans ./backend/controllers/sauces)
const saucesSchema = mongoose.Schema ({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true },
});

// Exportation du schéma de données pour l'exploiter comme modèle dans le projet avec le nom du modèle et la constante correspondante
module.exports = mongoose.model('Sauces', saucesSchema); 