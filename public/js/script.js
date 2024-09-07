getStatus();
setInterval(getStatus, 1000);

let isRunning = false;

function getStatus() {
    fetch('http://localhost:5000/status').then(response => {
        return response.json();
    }).then(data => {
        if (data.status === 'error') {
            isRunning = false;
        } else {
            isRunning = true;
        } 
        
        afficherEtatServeur();
        return;

        // if (data === '') console.log('Server is down');
        // else console.log('Server is up');
    }).catch(err => {
        console.log(err);
    });
}

function start() {
    alert('Starting server');
    fetch('http://localhost:5000/start').then(response => {
        return response.text();
    }).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}

function stop() {
    alert('Stopping server');
    fetch('http://localhost:5000/stop').then(response => {
        return response.text();
    }).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    })
};

// Fonction pour afficher le texte en fonction de l'état du serveur
function afficherEtatServeur() {
    const etatServeur = document.getElementById("etat-serveur");
    if (isRunning) {
        etatServeur.innerHTML = "Le serveur Fossason est actuellement <strong>EN MARCHE</strong>.";
        etatServeur.style.color = "green";
    } else {
        etatServeur.innerHTML = "Le serveur Fossason est actuellement <strong>HORS SERVICE</strong>.";
        etatServeur.style.color = "red";
    }
}

// Exécuter la fonction une fois la page chargée
window.onload = afficherEtatServeur;