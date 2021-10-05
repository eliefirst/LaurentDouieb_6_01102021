// Importation du plugin password-validator
const passwordValidator = require('password-validator');

// Création d'un schéma de données pour le mot de passe
const passwordSchema = new passwordValidator();

// Définition des propriétés du schéma de mot de passe
passwordSchema
.is().min(8)                                    // Doit contenir: au moins 8 caractères
.is().max(100)                                  // Jusqu'à une limite de 100 caractères
.has().uppercase()                              // Une majuscule
.has().lowercase()                              // Une minuscule
.has().digits(1)                                // Une chiffre
.has().not().spaces()                           // Sans espace
.is().not().oneOf(['Passw0rd', 'Password123']); // MDP interdits

// Exportation du schéma de données pour l'exploiter dans le middleware/password.js
module.exports = passwordSchema;