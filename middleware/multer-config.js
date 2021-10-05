// ---------------- IMPORTATIONS GÉNÉRALES ---------------------- // 

// Importation de multer
const multer = require('multer');



// --------------------- MIDDLEWARES ---------------------- // 

// Déclaration d'une constante pour générer une extension de fichier (jpg ou png)
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Objet de configuration de multer 
// Permet l'enregistrement sur le disque 
const storage = multer.diskStorage ({
    // 1er argument : destination / Explication à multer dans quel dossier enregistré le fichier image
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // 2e argument : filename / Explication à multer quel nom utilisé pour le fichier image
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    },
});

// Déclaration d'une constante pour limiter la taille des images téléchargées
const maxFileSize = 1 * 1024 * 1024;



// --------------------- EXPORTATIONS ---------------------- //

// Exportation du middleware complètement configuré
module.exports = multer({ storage, limits: {fileSize: maxFileSize} }).single('image');
