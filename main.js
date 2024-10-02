// main.js

const express = require('express');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');
const https = require('https'); // Import HTTPS module
const fs = require('fs'); // Import FS module

const app = express();
const PORT = 5000; // Non-privileged port

// CORS Configuration
const corsOptions = {
    origin: ['https://fossason.linkenparis.com', 'http://localhost'], // Allowed origins
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200 // Support for legacy browsers
};

// Apply CORS middleware before other middleware and routes
app.use(cors(corsOptions));

// Handle preflight (OPTIONS) requests for all routes
app.options('*', cors(corsOptions));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// PM2 Commands
const getStatusCommand = "pm2 pid bot-soundboard-back";
const startCommand = "pm2 start bot-soundboard-back";
const stopCommand = "pm2 stop bot-soundboard-back";

// API Endpoints

/**
 * Get the status of the bot-soundboard-back process.
 */
app.get('/status', async (req, res) => {
    try {
        const output = await executeCommand(getStatusCommand);
        if (output.includes('Error') || output.includes('Erreur') || output.trim() === '0') {
            throw new Error(output);
        }
        res.json({ status: 'success', message: output });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

/**
 * Start the bot-soundboard-back process.
 */
app.get('/start', async (req, res) => {
    try {
        const output = await executeCommand(startCommand);
        res.send(output);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * Stop the bot-soundboard-back process.
 */
app.get('/stop', async (req, res) => {
    try {
        const output = await executeCommand(stopCommand);
        res.send(output);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * Function to execute shell commands.
 * @param {string} command - The command to execute.
 * @returns {Promise<string>} - The stdout from the executed command.
 */
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`Execution Error: ${error.message}`));
                return;
            }
            if (stderr) {
                reject(new Error(`Command Error: ${stderr}`));
                return;
            }
            resolve(stdout);
        });
    });
}

// SSL Options
const options = {
    key: fs.readFileSync('/etc/nginx/_.linkenparis.com_private_key.key'), // Path to your private key
    cert: fs.readFileSync('/etc/nginx/linkenparis.com_ssl_certificate.cer') // Path to your SSL certificate
};

// Create HTTPS server
const server = https.createServer(options, app);

// Start HTTPS server on specified port
server.listen(PORT, () => {
    console.log(`HTTPS Server is running on https://localhost:${PORT}`);
});
