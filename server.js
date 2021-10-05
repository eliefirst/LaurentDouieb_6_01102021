// ---------------- IMPORTATIONS GÉNÉRALES ---------------------- // 

// Importation du package HTTP natif de Node pour l'utiliser pour créer un serveur
const http = require('http');
// Importation de l'application Express (app.js)
const app = require('./app');



// ---------------- FONCTIONS ET CONFIGURATION DU SERVEUR ---------------------- // 

// La fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// La fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. 
// Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};


// Fonction permettant d'écouter soit
// la variable d'environnement du port grâce à process.env.PORT : si la plateforme de déploiement propose un port par défaut, c'est celui-ci qu'on écoutera ;
// OU le port 3000, ce qui nous servira dans le cas de notre plateforme de développement.
const port = normalizePort(process.env.PORT || '3000');
// Indication à l'app Express sur quel port tourner
app.set('port', port);

// Fonction exécutée à chaque appel vers le serveur (app Express passé en argument)
// Fonction qui reçoit la requête et la réponse
const server = http.createServer(app);

// Un écouteur d'évènements est également enregistré, 
// Consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

// Configuration du serveur pour qu'il écoute la fonction port (le serveur écoute et attends les requêtes envoyées)
server.listen(port);
