// ---------------- IMPORTATIONS GÉNÉRALES ---------------------- // 

// Importatin du modèle 'Password' pour l'utiliser dans le middleware
const passwordSchema = require("../models/Password");



// --------------------- MIDDLEWARES ---------------------- // 

// ---- Middleware servant à la validation d'un mdp ---- //

module.exports = (req, res, next) => {
    // Si le mot de passe ne remplit pas les conditions/règles du mdp rentré 
    if (!passwordSchema.validate(req.body.password)) {
        // Affichage d'un message d'erreur 
        return res.status(400).json({ 
            error: 'Veuillez renseigner un mot de passe complexe ! Il doit contenir au moins, un chiffre, une minuscule, une majuscule et au moins 8 caractères !' +
            passwordSchema.validate('Essayez un autre mot de passe !', { list: true }),
        });
    // Sinon le mdp est accepté
    } else {
        next();
    }
};