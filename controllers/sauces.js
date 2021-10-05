// ---------------- IMPORTATIONS GÉNÉRALES ---------------------- // 

// Importatin du modèle 'Sauces' pour l'utiliser dans les fonctions
const Sauce = require('../models/Sauces');

// Importation du modèle 'Like' pour l'utiliser dans les fonctions
const Like = require('../models/Like');

// Importation de file system pour la gestion des fichiers (de Node)
const fs = require('fs');



// --------------------- CONTROLLERS ---------------------- // 

// ---- Fonction permettant de créer un objet 'sauce' ---- //

exports.createSauce = (req, res, next) => {
    // Récupération et transformation du req.body.sauce (string) en objet JS utilisable
    const sauceObject = JSON.parse(req.body.sauce);
    // Suppression de l'id (qui va être généré automatiquement par MongoDB)
    delete sauceObject._id;
    // Création d'une nouvelle instance de Sauce (à partir de '../models/Sauces')
    const sauce = new Sauce ({
        // L'opérateur spread pour faire une copie de tous les éléments de req.body.sauce
        ...sauceObject,
        // Résolution URL complète de l'image 
        // (req.protocol = 'http' + '://' + req.get('host') = 'localhost:3000' + '/images/' + nom du fichier)
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // Implémentation des likes/dislikes à 0
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersdisLiked : []
    });
    // Enregistrement de la sauce dans MongoDB
    sauce.save()
        // La promesse se résout et un message nous indique que l'opération s'est bien déroulée
        .then(() => res.status(201).json({ message: ' Objet enregistré !' }))
        // Sinon un message d'erreur s'affiche
        .catch(error => res.status(400).json({ error }));
};


// ---- Fonction permettant de modifier un objet 'sauce' ---- //

exports.modifySauce =  (req, res, next) => {
    // Création de l'objet JS en prenant compte des modifications
    // (? permet de savoir si un req.file/une image existe déjà)
    const sauceObject = req.file ? { // Si oui
        // Transformation du req.body.sauce (string) en objet JS utilisable
        ...JSON.parse(req.body.sauce),
        // Modification de l'adresse URL menant à l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : {...req.body}; // On modifie uniquement le titre/description/etc... (pas l'image) de la sauce
    // Mise à jour de la sauce en la remplaçant par la sauce passée comme second argument
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) 
        // La promesse se résout et un message nous indique que l'opération s'est bien déroulée
        .then(()=> res.status(200).json({ message: 'Objet modifié !' }))
        // Sinon un message d'erreur s'affiche
        .catch(error => res.status(400).json({ error }));
};

// ---- Fonction permettant de supprimer un objet 'sauce' ---- //

exports.deleteSauce = (req, res, next) => {
    // Recherche dans la base de données de la sauce à supprimer avec son identifiant
    Sauce.findOne({ _id: req.params.id })
        // La promesse se résout (on trouve la sauce avec son identifiant)
        .then( sauce => { 
            // Recherche du nom du fichier de l'image
            const filename = sauce.imageUrl.split('/images')[1]
            // Utilisation de 'file system' pour supprimer le fichier du dossier 'images'
            fs.unlink(`images/${filename}`, () => { 
                // Et suppression également depuis la base de données
                Sauce.deleteOne({ _id: req.params.id })
                    // La promesse se résout et un message nous indique que l'opération s'est bien déroulée
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    // Sinon un message d'erreur s'affiche (fichier introuvable ou inexistant)
                    .catch(error => res.status(404).json({ error }));
            })
        })
        // Sinon un message d'erreur s'affiche (erreur serveur)
        .catch(error => res.status(500).json({ error }));
}; 

// ---- Fonction permettant de récupérer un seul objet 'sauce' ---- //

exports.getOneSauce = (req, res, next) => {
    // Recherche dans la base de données de la sauce avec son identifiant
    Sauce.findOne({ _id: req.params.id })
        // La promesse se résout, on accède à la page produit de la sauce demandée
        .then(sauce => res.status(200).json(sauce))
        // Sinon un message d'erreur s'affiche (sauce introuvable ou inexistante)
        .catch(error => res.status(404).json({ error }));
};

// ---- Fonction permettant de récupérer tous les objets 'sauce' ---- //

exports.getAllSauces = (req, res, next) => {
    // Recherche dans la base de données de toutes les sauces
    Sauce.find() 
        // La promesse se résout, on accède à la page affichant toutes les sauces
        .then(sauces => res.status(200).json(sauces)) 
        // Sinon un message d'erreur s'affiche (erreur client)
        .catch(error => res.status(400).json({ error }));
};

// ---- Fonction permettant de liker ou disliker un objet 'sauce' ---- //

exports.likeOrDislikeSauce = (req, res, next) => {

    // Définition du statut « Like » pour l'userId fourni ( 1 = like, 0 = annuler notation, -1 = dislike )
    const likeValue = req.body.like;
    // Récupération de l'userId (un seul utilisateur n'a qu'une seule valeur pour une sauce)
    const userId = req.body.userId;

    // Récupération de l'identifiant de la sauce à liker ou disliker
    Sauce.findOne({ _id: req.params.id })
    // Promesse qui se résout si on trouve la sauce
    .then(sauce => {
        // Tableaux permettant de stocker le like/dislike d'un utilisateur avec son userId
        let newUsersLiked = sauce.usersLiked;
        let newUsersDisliked = sauce.usersDisliked;
        // Si like = 1, l'utilisateur aime (= like) la sauce
        if (likeValue == 1) {
            // On ajoute l'identifiant de l'utilisateur qui a liké au tableau 'UsersLiked' (méthode push())
            newUsersLiked.push(userId)
            // Et on incrémente un like
            const newLikes = newUsersLiked.length
            // Mise à jour du nombre de like de la sauce avec son identifiant
            // (avec le nouveau 'like' de l'userId de l'utilisateur correspondant)
            Sauce.updateOne({ _id: req.params.id },{
                likes: newLikes,
                usersLiked: newUsersLiked
            }) 
        // Si la promesse se résout, un message indique que l'opération s'est bien déroulée
        .then(()=> res.status(200).json({ message : 'Vous avez likée cette sauce !'}))
        // Sinon un message d'erreur s'affiche
        .catch(error => res.status(400).json({ error }));
        }
        // Si like = 0, l'utilisateur annule son like ou son dislike
        else if (likeValue == 0) {
            // Constante permettant de chercher l'userId du tableau 'newUsersLiked'
            const indexToRemoveFromLikes = newUsersLiked.indexOf(userId)
                // Si l'élément cherché (userId) est présent dans ce tableau
                if (indexToRemoveFromLikes !== -1 ) {
                    // On enlève un like du tableau
                    newUsersLiked.splice(indexToRemoveFromLikes,1)
                }
            // Mise à jour du nouveau tableau (avec le like en moins)
            const newLikes = newUsersLiked.length
            // Constante permettant de chercher l'userId du tableau 'newUsersDisliked'
            const indexToRemoveFromDislikes = newUsersDisliked.indexOf(userId)
                // Si l'élément cherché (userId) est présent dans ce tableau
                if (indexToRemoveFromDislikes !== -1 ) {
                    // On enlève un dislike du tableau
                    newUsersDisliked.splice(indexToRemoveFromDislikes,1)
                }
            // Mise à jour du nouveau tableau (avec le dislike en moins)
            const newDislikes = newUsersDisliked.length
            // Mise à jour globale du nombre de like et dislike (dans les tableaux usersLiked et usersDisliked) de la sauce avec son identifiant
            Sauce.updateOne({ _id: req.params.id },{
                likes: newLikes,
                dislikes: newDislikes,
                usersLiked: newUsersLiked,
                usersDisliked: newUsersDisliked
            })
            // Si la promesse se résout, un message indique que l'opération s'est bien déroulée
            .then(()=> res.status(200).json({ message: 'Notation annulée !' }))
            // Sinon un message d'erreur s'affiche
            .catch(error => res.status(400).json({ error })); 
        }
        // Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce
        else if (likeValue == -1) {
            // On ajoute l'identifiant de l'utilisateur qui a disliké au tableau 'UsersDisliked' (méthode push())
            newUsersDisliked.push(userId)
            // Et on incrémente un dislike
            const newDislikes = newUsersDisliked.length
            /// Mise à jour du nombre de dislike de la sauce avec son identifiant
            // (avec le nouveau 'dislike' de l'userId de l'utilisateur correspondant)
            Sauce.updateOne({ _id: req.params.id },{
                dislikes: newDislikes,
                usersDisliked: newUsersDisliked
            })
            // Si la promesse se résout, un message indique que l'opération s'est bien déroulée
            .then(()=> res.status(200).json({ message: 'Vous avez dislikée cette sauce !' }))
            // Sinon un message d'erreur s'affiche
            .catch(error => res.status(400).json({ error }));
        }
    })
    // Si la sauce est introuvable un message d'erreur s'affiche (404)
    .catch(error => res.status(400).json({ error }));
} 