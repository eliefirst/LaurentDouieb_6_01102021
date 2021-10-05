// ---------------- IMPORTATIONS GÉNÉRALES ---------------------- // 

// Importation du package de chiffrement bcrypt pour crypter les mots de passe
const bcrypt = require('bcrypt');

// Importation du package pour créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

// Importatin du modèle 'User' pour l'utiliser dans les deux fonctions 'signup' et 'login'
const User = require('../models/User');



// --------------------- CONTROLLERS ---------------------- // 

// ---- Fonction/Middleware 'signup' permettant d'enregistrer de nouveaux utilisateurs ---- //

// Fonction permet le cryptage du mot de passe, et créer un utilisateur avec le mdp crypté dans la base de données
exports.signup = (req, res, next) => {
    // Nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois.
    bcrypt.hash(req.body.password, 10) 
        // Fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré
        .then(hash => {
            // Nous créons un utilisateur et l'enregistrons dans la base de données
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Enregistrement du nouvel utilisateur
            user.save()
                // Si la promesse se résout, on indique que l'utilisateur a bien été créé
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                // Sinon un message d'erreur s'affiche
                .catch(error => res.status(400).json({ error }));
        })
        // Sinon un message d'erreur s'affiche
        .catch(error => res.status(500).json({ error }));
};

// ---- Fonction/Middleware 'login' permettant de connecter les utilisateurs existants ---- //

exports.login = (req, res, next) => {
    // Récupération de l'utilisateur de la base de données qui correspond à l'adresse email rentrée
    User.findOne({ email: req.body.email })
        // Si l'utilisateur n'est pas reconnu on envoie une erreur
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé ! '});
            }
            // Comparaison du mdp rentré avec le hash qui est gardé dans la base de données
            bcrypt.compare(req.body.password, user.password)
                // Si la comparaison est mauvaise on renvoie un message d'erreur
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si la comparaison est bonne (il a été rentré les identifiants valables)
                    // On renvoie l'identifiant de l'utilisateur et un TOKEN permettant de se connecter à sa session
                    res.status(200).json({
                        userId: user._id,
                        // Méthode sign de jwt pour encoder un nouveau token
                        token: jwt.sign(
                            // Ce token contient l'ID de l'utilisateur en tant que payload (données encodées dans le token)
                            { userId: user._id },
                            // Chaîne secrète de développement temporaire pour encoder notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production)
                            process.env.TOKEN_SECRET_KEY,
                            // Durée de validité du token : 24 heures
                            { expiresIn: '24h' }
                        )
                    });
                })
                // Sinon un message d'erreur s'affiche
                .catch(error => res.status(500).json({ error }));
        })
        // Sinon un message d'erreur s'affiche
        .catch(error => res.status(500).json({ error }));
};