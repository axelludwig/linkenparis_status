const express = require('express');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = 5000; // Port non privilégié

// Configuration CORS
const corsOptions = {
    origin: ['https://fossason.linkenparis.com', 'http://localhost'], // Utiliser un tableau d'origines
    optionsSuccessStatus: 200 // Pour le support des navigateurs anciens
};

// Appliquer le middleware CORS avec les origines spécifiques
app.use(cors(corsOptions));

// Servir les fichiers statiques depuis le dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route pour servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Commandes PM2
const getStatusCommand = "pm2 pid bot-soundboard-back";
const startCommand = "pm2 start bot-soundboard-back";
const stopCommand = "pm2 stop bot-soundboard-back";

// Endpoints API
app.get('/status', async (req, res) => {
    try {
        const output = await executeCommand(getStatusCommand);
        if (output.includes('Error') || output.includes('Erreur') || output.trim() === '0') {
            throw new Error(output);
        }
        res.json({ status: 'success', message: output });
    } catch (err) {
        res.json({ status: 'error', message: err.message });
    }
});

app.get('/start', async (req, res) => {
    try {
        const output = await executeCommand(startCommand);
        res.send(output);
    } catch (err) {
        res.send(err.message);
    }
});

app.get('/stop', async (req, res) => {
    try {
        const output = await executeCommand(stopCommand);
        res.send(output);
    } catch (err) {
        res.send(err.message);
    }
});

// Fonction pour exécuter des commandes shell
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`Erreur d'exécution : ${error.message}`));
                return;
            }
            if (stderr) {
                reject(new Error(`Erreur dans la commande : ${stderr}`));
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