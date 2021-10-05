// ---------------- IMPORTATIONS GÉNÉRALES ---------------------- // 

// Importation du package jsonwebtoken pour la création et la vérification des tokens
const jwt = require('jsonwebtoken');



// --------------------- MIDDLEWARES ---------------------- // 

// ---- Middleware servant à l'authentification d'un utilisateur ---- //

module.exports = (req, res, next) => {
    // Instructions qu'on souhaite exécuter
    try {
        // Extraction du token du header Authorization de la requête entrante
        // N'oubliez pas qu'il contiendra également le mot-clé Bearer devant
        // Fonction split pour récupérer tout après l'espace dans le header
        const token = req.headers.authorization.split(' ')[1];
        // Fonction verify de jwt pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Extraction ID utilisateur du token
        const userId = decodedToken.userId;
        // Si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. 
        // S'ils sont différents, nous générons une erreur
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !'
        // Dans le cas contraire, tout fonctionne et notre utilisateur est authentifié
        } else {
            next();
        }
    // Sinon un message d'erreur s'affiche
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};