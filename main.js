const { error } = require('console');
const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000; // Ton port


var exec = require('child_process').exec;
// Configurer express pour servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Route pour servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let getStatusCommand = "pm2 pid bot-soundboard-back";
let startCommand = "pm2 start bot-soundboard-back";
let stopCommand = "pm2 stop bot-soundboard-back";

// Configurer express pour servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Route pour servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/status', (req, res) => {
    let response;
    executeCommand(getStatusCommand).then(output => {
        console.log("error");

        if (output.includes('Error') || output.includes('Erreur')) {
            throw new Error(output);
        }
        response = { status: 'status', message: output };
        res.send(response);

    }).catch(err => {
        response = { status: 'error', message: err };
        res.send(response);
    });


    // execute(getStatusCommand, function (output) { res.send(output); });
})

app.get('/start', (req, res) => {
    executeCommand(startCommand).then(output => {
        res.send(output);
    }).catch(err => {
        res.send(err);
    });

    // console.log('Starting server');
    // execute(startCommand, function (output) { console.log(output); });
})

app.get('/stop', (req, res) => {
    executeCommand(stopCommand).then(output => {
        res.send(output);
    }).catch(err => {
        res.send(err);
    });

    // execute(stopCommand, function (output) { console.log(output); });
})


// function execute(command, callback) {
//     exec(command, function (error, stdout, stderr) { callback(stdout); });
// };

function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Erreur lors de l'exécution de la commande : ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`Erreur dans la commande : ${stderr}`);
                return;
            }
            resolve(stdout);
        });
    });
}

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});