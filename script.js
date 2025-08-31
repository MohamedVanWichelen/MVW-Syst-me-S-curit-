// Terminal Administrateur - Système de Commandes Réaliste
const SYSTEM_CONFIG = {
    password: 'moi', // Mot de passe administrateur
    username: 'admin',
    maxAttempts: 3,
    lockoutTime: 60000, // 1 minute
    projectsPage: 'projects.html'
};

// Variables globales
let attempts = 0;
let isLocked = false;
let lockoutTimer = null;
let isAuthenticated = false;
let commandHistory = [];
let historyIndex = -1;
let currentPath = '/var/admin';

// Éléments DOM
const terminalOutput = document.getElementById('terminal-output');
const commandInput = document.getElementById('command-input');
const lockoutIndicator = document.getElementById('lockout-indicator');
const lockoutTimerElement = document.getElementById('lockout-timer');
const loadingOverlay = document.getElementById('loading-overlay');
const currentTimeElement = document.getElementById('current-time');

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeTerminal();
    updateTime();
    setInterval(updateTime, 1000);
    
    // Focus sur l'input
    commandInput.focus();
    
    // Gestion des événements clavier
    commandInput.addEventListener('keydown', handleKeyDown);
    
    // Gestion de la soumission des commandes
    commandInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            executeCommand();
        }
    });
});

// Initialisation du terminal
function initializeTerminal() {
    console.log('Terminal Administrateur initialisé');
    
    // Détecter les informations système réelles
    detectSystemInfo();
    
    // Message de démarrage
    addOutputLine('Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)', 'system');
    addOutputLine('', 'system');
    addOutputLine('* Documentation:  https://help.ubuntu.com/', 'system');
    addOutputLine('* Management:     https://landscape.canonical.com', 'system');
    addOutputLine('* Support:        https://ubuntu.com/advantage', 'system');
    addOutputLine('', 'system');
    addOutputLine('System information as of ' + new Date().toLocaleString('fr-FR'), 'system');
    addOutputLine('', 'system');
    
    // Afficher les informations système détectées
    displaySystemInfo();
    
    addOutputLine('', 'system');
    addOutputLine('Last login: ' + new Date().toLocaleString('fr-FR') + ' from ' + getClientIP(), 'system');
    addOutputLine('', 'system');
    addOutputLine('=== SYSTÈME D\'AUTHENTIFICATION ADMINISTRATEUR ===', 'info');
    addOutputLine('Accès restreint - Authentification requise', 'warning');
    addOutputLine('', 'system');
    
    // Demander l'authentification
    requestAuthentication();
}

// Mise à jour de l'heure
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    currentTimeElement.textContent = timeString;
    
    // Mettre à jour les informations météo si disponibles
    if (window.weatherInfo) {
        updateWeatherDisplay();
    }
}

// Détection des informations système réelles
function detectSystemInfo() {
    // Détecter le navigateur et l'OS
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    
    // Détecter la résolution d'écran
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const colorDepth = screen.colorDepth;
    
    // Détecter la mémoire (si disponible)
    const memory = navigator.deviceMemory || 'N/A';
    
    // Détecter les cœurs CPU (si disponible)
    const cores = navigator.hardwareConcurrency || 'N/A';
    
    // Stocker les informations pour utilisation ultérieure
    window.systemInfo = {
        userAgent,
        platform,
        language,
        screenWidth,
        screenHeight,
        colorDepth,
        memory,
        cores,
        timestamp: new Date().toISOString()
    };
    
    // Mettre à jour l'affichage des informations de l'appareil
    updateDeviceInfo();
    
    // Détecter la géolocalisation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                window.systemInfo.location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                
                // Obtenir la température et les informations météo
                getWeatherInfo(position.coords.latitude, position.coords.longitude);
            },
            function(error) {
                console.log('Erreur de géolocalisation:', error);
                window.systemInfo.location = null;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }
}

// Affichage des informations système
function displaySystemInfo() {
    const info = window.systemInfo;
    
    if (info) {
        // Informations du navigateur et de l'appareil
        addOutputLine('=== INFORMATIONS APPARAIL ===', 'info');
        addOutputLine('Platform:     ' + info.platform, 'system');
        addOutputLine('Browser:      ' + getBrowserInfo(), 'system');
        addOutputLine('Language:     ' + info.language, 'system');
        addOutputLine('Screen:       ' + info.screenWidth + 'x' + info.screenHeight + ' (' + info.colorDepth + ' bits)', 'system');
        addOutputLine('Memory:       ' + info.memory + ' GB', 'system');
        addOutputLine('CPU Cores:    ' + info.cores, 'system');
        addOutputLine('User Agent:   ' + info.userAgent.substring(0, 80) + '...', 'system');
        
        // Informations de localisation (si disponibles)
        if (info.location) {
            addOutputLine('', 'system');
            addOutputLine('=== INFORMATIONS LOCALISATION ===', 'info');
            addOutputLine('Latitude:    ' + info.location.latitude.toFixed(6), 'system');
            addOutputLine('Longitude:   ' + info.location.longitude.toFixed(6), 'system');
            addOutputLine('Accuracy:    ±' + Math.round(info.location.accuracy) + ' m', 'system');
            
            // Afficher la température et météo si disponibles
            if (window.weatherInfo) {
                addOutputLine('City:        ' + window.weatherInfo.city, 'system');
                addOutputLine('Temperature: ' + window.weatherInfo.temperature + '°C', 'system');
                addOutputLine('Weather:     ' + window.weatherInfo.description, 'system');
                addOutputLine('Humidity:    ' + window.weatherInfo.humidity + '%', 'system');
            }
        }
        
        addOutputLine('', 'system');
        
        // Démarrer l'animation cinématographique après l'affichage des informations
        setTimeout(() => {
            startCinematicSequence();
        }, 1000);
    }
}

// Séquence cinématographique avec frappe automatique
function startCinematicSequence() {
    const messages = [
        { text: '=== SYSTÈME D\'AUTHENTIFICATION ADMINISTRATEUR ===', type: 'info', delay: 0, speed: 30 },
        { text: 'Accès restreint - Authentification requise', type: 'warning', delay: 1000, speed: 40 },
        { text: '', type: 'system', delay: 2000, speed: 0 },
        { text: 'root@secure-server:/var/admin# su - admin', type: 'command', delay: 2500, speed: 25 },
        { text: 'Password: ', type: 'system', delay: 4000, speed: 0 }
    ];
    
    let currentIndex = 0;
    
    function displayNextMessage() {
        if (currentIndex < messages.length) {
            const message = messages[currentIndex];
            
            setTimeout(() => {
                if (message.speed > 0) {
                    addOutputLineWithTypewriter(message.text, message.type, message.speed);
                } else {
                    addOutputLine(message.text, message.type);
                }
                currentIndex++;
                displayNextMessage();
            }, message.delay);
        } else {
            // Afficher le message mystérieux dans le terminal
            setTimeout(() => {
                showMysteriousMessage();
            }, 1000);
        }
    }
    
    displayNextMessage();
}

// Affichage du message mystérieux dans le terminal
function showMysteriousMessage() {
    setTimeout(() => {
        addOutputLine('', 'system');
        addOutputLine('', 'system');
        addOutputLine('=== MESSAGE SYSTÈME ===', 'info');
        addOutputLine('', 'system');
        addOutputLine('Bonjour maître, est-ce vous ?', 'warning');
        addOutputLine('', 'system');
        addOutputLine('Si oui mais que vous avez oublié votre mot de passe, pas de soucis...', 'warning');
        addOutputLine('', 'system');
        addOutputLine('La réponse est simplement la chose que vous Aimer le plus', 'success');
        addOutputLine('', 'system');
        addOutputLine('', 'system');
        
        // Démarrer l'authentification après le message mystérieux
        setTimeout(() => {
            requestAuthentication();
        }, 2000);
    }, 500);
}

// Détection du navigateur
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) {
        const version = userAgent.match(/Chrome\/(\d+)/);
        return 'Google Chrome ' + (version ? version[1] : '');
    } else if (userAgent.includes('Firefox')) {
        const version = userAgent.match(/Firefox\/(\d+)/);
        return 'Mozilla Firefox ' + (version ? version[1] : '');
    } else if (userAgent.includes('Safari')) {
        const version = userAgent.match(/Version\/(\d+)/);
        return 'Safari ' + (version ? version[1] : '');
    } else if (userAgent.includes('Edge')) {
        const version = userAgent.match(/Edge\/(\d+)/);
        return 'Microsoft Edge ' + (version ? version[1] : '');
    } else {
        return 'Navigateur inconnu';
    }
}

// Obtenir l'IP du client (simulation)
function getClientIP() {
    // Simulation d'une IP locale
    const ips = ['192.168.1.100', '192.168.1.101', '192.168.1.102', '10.0.0.50'];
    return ips[Math.floor(Math.random() * ips.length)];
}

// Obtenir les informations météo
function getWeatherInfo(lat, lon) {
    // Utiliser l'API météo gratuite wttr.in
    const url = `https://wttr.in/?format=j1&lang=fr`;
    
    // Simulation des données météo réalistes (en cas d'échec de l'API)
    const mockWeather = {
        city: 'Votre Ville',
        temperature: Math.round(15 + Math.random() * 20), // 15-35°C
        description: 'Ensoleillé',
        humidity: Math.round(40 + Math.random() * 40) // 40-80%
    };
    
    // Essayer d'obtenir les vraies données météo via wttr.in
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.nearest_area && data.current_condition) {
                const current = data.current_condition[0];
                const area = data.nearest_area[0];
                
                window.weatherInfo = {
                    city: area.areaName[0].value || 'Votre Ville',
                    temperature: Math.round(parseFloat(current.temp_C)),
                    description: current.lang_fr ? current.lang_fr[0].value : current.weatherDesc[0].value,
                    humidity: parseInt(current.humidity)
                };
            } else {
                window.weatherInfo = mockWeather;
            }
            
            // Mettre à jour l'affichage si le terminal est déjà initialisé
            if (window.systemInfo && window.systemInfo.location) {
                updateWeatherDisplay();
            }
        })
        .catch(error => {
            console.log('Erreur API météo:', error);
            window.weatherInfo = mockWeather;
            
            if (window.systemInfo && window.systemInfo.location) {
                updateWeatherDisplay();
            }
        });
}

// Mise à jour de l'affichage météo
function updateWeatherDisplay() {
    if (window.weatherInfo && currentTimeElement) {
        // Mettre à jour l'en-tête du terminal avec la température
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const weatherText = ` | ${window.weatherInfo.temperature}°C | ${window.weatherInfo.city}`;
            if (!timeElement.textContent.includes('°C')) {
                timeElement.textContent += weatherText;
            }
        }
    }
}

// Mise à jour des informations de l'appareil dans l'en-tête
function updateDeviceInfo() {
    const deviceInfoElement = document.getElementById('device-info');
    if (deviceInfoElement && window.systemInfo) {
        const info = window.systemInfo;
        const browser = getBrowserInfo().split(' ')[0]; // Prendre juste le nom du navigateur
        const platform = info.platform.includes('Mac') ? 'MAC' : 
                        info.platform.includes('Win') ? 'WINDOWS' : 
                        info.platform.includes('Linux') ? 'LINUX' : 'UNKNOWN';
        
        deviceInfoElement.textContent = `DEVICE: ${platform} | ${browser}`;
    }
}

// Demande d'authentification
function requestAuthentication() {
    addOutputLine('root@secure-server:/var/admin# su - admin', 'command');
    addOutputLine('Password: ', 'system');
    
    // Garder l'input en texte visible pour le mot de passe
    commandInput.type = 'text';
    commandInput.placeholder = 'Mot de passe requis';
    
    // Écouter la touche Entrée pour valider le mot de passe
    commandInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const password = this.value;
            this.value = '';
            authenticatePassword(password);
        }
    });
}

// Authentification du mot de passe
function authenticatePassword(password) {
    if (isLocked) {
        showLockoutMessage();
        return;
    }
    
    if (!password || password.trim() === '') {
        addOutputLine('su: Authentication failure', 'error');
        addOutputLine('', 'system');
        addOutputLine('', 'system');
        requestAuthentication();
        return;
    }
    
    // Simulation de vérification
    showLoading(true);
    
    setTimeout(() => {
        if (password === SYSTEM_CONFIG.password) {
            authenticationSuccess();
        } else {
            authenticationFailed();
        }
        showLoading(false);
    }, 1500);
}

// Succès de l'authentification
function authenticationSuccess() {
    isAuthenticated = true;
    addOutputLine('', 'system');
    addOutputLine('Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_0)', 'success');
    addOutputLine('', 'system');
    addOutputLine('=== ACCÈS AUTORISÉ ===', 'success');
    addOutputLine('Bienvenue dans le terminal administrateur', 'success');
    addOutputLine('Redirection automatique vers la gestion des projets...', 'info');
    addOutputLine('', 'system');
    
    // Redirection automatique vers la page des projets
    setTimeout(() => {
        window.location.href = SYSTEM_CONFIG.projectsPage;
    }, 2000);
}

// Échec de l'authentification
function authenticationFailed() {
    attempts++;
    addOutputLine('su: Authentication failure', 'error');
    addOutputLine('', 'system');
    
    if (attempts >= SYSTEM_CONFIG.maxAttempts) {
        lockoutSystem();
    } else {
        addOutputLine(`Tentative ${attempts}/${SYSTEM_CONFIG.maxAttempts}`, 'warning');
        addOutputLine('', 'system');
        requestAuthentication();
    }
}

// Verrouillage du système
function lockoutSystem() {
    isLocked = true;
    addOutputLine('*** SYSTÈME VERROUILLÉ ***', 'error');
    addOutputLine('Trop de tentatives d\'authentification échouées', 'error');
    addOutputLine('Verrouillage de sécurité activé', 'error');
    addOutputLine('', 'system');
    
    showLockoutMessage();
    
    // Timer de déverrouillage
    lockoutTimer = setTimeout(() => {
        unlockSystem();
    }, SYSTEM_CONFIG.lockoutTime);
}

// Affichage du message de verrouillage
function showLockoutMessage() {
    lockoutIndicator.classList.add('active');
    startLockoutTimer();
}

// Démarrage du timer de verrouillage
function startLockoutTimer() {
    let timeLeft = SYSTEM_CONFIG.lockoutTime / 1000;
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        lockoutTimerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timer);
        }
    }, 1000);
}

// Déverrouillage du système
function unlockSystem() {
    isLocked = false;
    attempts = 0;
    
    lockoutIndicator.classList.remove('active');
    
    addOutputLine('*** SYSTÈME DÉVERROUILLÉ ***', 'success');
    addOutputLine('Vous pouvez maintenant réessayer l\'authentification', 'info');
    addOutputLine('', 'system');
    
    requestAuthentication();
}

// Affichage du prompt normal
function showNormalPrompt() {
    updateCurrentPath();
}

// Mise à jour du chemin actuel
function updateCurrentPath() {
    const pathElement = document.querySelector('.current-path');
    if (pathElement) {
        pathElement.textContent = currentPath;
    }
}

// Gestion des touches clavier
function handleKeyDown(e) {
    if (!isAuthenticated) return;
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            navigateHistory('up');
            break;
        case 'ArrowDown':
            e.preventDefault();
            navigateHistory('down');
            break;
        case 'Tab':
            e.preventDefault();
            // Auto-complétion (optionnel)
            break;
    }
}

// Navigation dans l'historique
function navigateHistory(direction) {
    if (commandHistory.length === 0) return;
    
    if (direction === 'up') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
        }
    } else {
        if (historyIndex > 0) {
            historyIndex--;
        } else if (historyIndex === 0) {
            historyIndex = -1;
            commandInput.value = '';
            return;
        }
    }
    
    if (historyIndex >= 0) {
        commandInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
    }
}

// Exécution des commandes
function executeCommand() {
    const command = commandInput.value.trim();
    
    if (!command) {
        addOutputLine('admin@secure-server:' + currentPath + '$ ', 'command');
        return;
    }
    
    // Ajouter à l'historique
    if (command !== commandHistory[commandHistory.length - 1]) {
        commandHistory.push(command);
    }
    historyIndex = -1;
    
    // Afficher la commande
    addOutputLine('admin@secure-server:' + currentPath + '$ ' + command, 'command');
    
    // Exécuter la commande
    processCommand(command);
    
    // Réinitialiser l'input
    commandInput.value = '';
    
    // Afficher le nouveau prompt
    setTimeout(() => {
        addOutputLine('admin@secure-server:' + currentPath + '$ ', 'command');
    }, 100);
}

// Traitement des commandes
function processCommand(command) {
    const cmd = command.toLowerCase().split(' ')[0];
    const args = command.split(' ').slice(1);
    
    switch(cmd) {
        case 'help':
            showHelp();
            break;
        case 'clear':
            clearTerminal();
            break;
        case 'ls':
            listFiles(args);
            break;
        case 'pwd':
            showCurrentPath();
            break;
        case 'cd':
            changeDirectory(args);
            break;
        case 'projects':
            accessProjects();
            break;
        case 'status':
            showSystemStatus();
            break;
        case 'whoami':
            showUserInfo();
            break;
        case 'date':
            showDate();
            break;
        case 'exit':
        case 'logout':
            logout();
            break;
        default:
            addOutputLine(`bash: ${cmd}: command not found`, 'error');
            addOutputLine(`Type 'help' for available commands`, 'info');
    }
}

// Affichage de l'aide
function showHelp() {
    addOutputLine('Commandes disponibles:', 'info');
    addOutputLine('  help      - Affiche cette aide', 'system');
    addOutputLine('  clear     - Efface l\'écran', 'system');
    addOutputLine('  ls        - Liste les fichiers', 'system');
    addOutputLine('  pwd       - Affiche le répertoire actuel', 'system');
    addOutputLine('  cd        - Change de répertoire', 'system');
    addOutputLine('  projects  - Accès à la gestion des projets', 'system');
    addOutputLine('  status    - Statut du système', 'system');
    addOutputLine('  whoami    - Informations utilisateur', 'system');
    addOutputLine('  date      - Date et heure actuelles', 'system');
    addOutputLine('  exit      - Déconnexion', 'system');
}

// Effacement du terminal
function clearTerminal() {
    terminalOutput.innerHTML = '';
}

// Liste des fichiers
function listFiles(args) {
    const path = args[0] || currentPath;
    
    if (path === '/var/admin') {
        addOutputLine('total 8', 'system');
        addOutputLine('drwxr-xr-x 2 admin admin 4096 Jan 15 10:30 .', 'system');
        addOutputLine('drwxr-xr-x 3 root  root  4096 Jan 15 10:30 ..', 'system');
        addOutputLine('-rw-r--r-- 1 admin admin  123 Jan 15 10:30 config.txt', 'system');
        addOutputLine('-rw-r--r-- 1 admin admin  456 Jan 15 10:30 projects.db', 'system');
    } else {
        addOutputLine(`ls: cannot access '${path}': No such file or directory`, 'error');
    }
}

// Affichage du chemin actuel
function showCurrentPath() {
    addOutputLine(currentPath, 'system');
}

// Changement de répertoire
function changeDirectory(args) {
    const path = args[0];
    
    if (!path || path === '~') {
        currentPath = '/home/admin';
    } else if (path === '..') {
        const parts = currentPath.split('/');
        if (parts.length > 1) {
            currentPath = parts.slice(0, -1).join('/') || '/';
        }
    } else if (path.startsWith('/')) {
        currentPath = path;
    } else {
        currentPath = currentPath + '/' + path;
    }
    
    updateCurrentPath();
}

// Accès aux projets
function accessProjects() {
    addOutputLine('Redirection vers la gestion des projets...', 'info');
    addOutputLine('', 'system');
    
    setTimeout(() => {
        window.location.href = SYSTEM_CONFIG.projectsPage;
    }, 1000);
}

// Statut du système
function showSystemStatus() {
    addOutputLine('=== STATUT DU SYSTÈME ===', 'info');
    addOutputLine('CPU: Intel Core i7-10700K @ 3.80GHz', 'system');
    addOutputLine('RAM: 16GB DDR4-3200', 'system');
    addOutputLine('OS: Ubuntu 22.04.3 LTS', 'system');
    addOutputLine('Kernel: 5.15.0-91-generic', 'system');
    addOutputLine('Uptime: 2 days, 3 hours, 45 minutes', 'system');
    addOutputLine('Load average: 0.52, 0.48, 0.45', 'system');
    addOutputLine('Processes: 245', 'system');
    addOutputLine('Users: 1', 'system');
}

// Informations utilisateur
function showUserInfo() {
    addOutputLine('admin', 'system');
}

// Date et heure
function showDate() {
    const now = new Date();
    addOutputLine(now.toLocaleString('fr-FR'), 'system');
}

// Déconnexion
function logout() {
    addOutputLine('Déconnexion...', 'info');
    addOutputLine('', 'system');
    
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

// Affichage du chargement
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

// Ajout d'une ligne de sortie
function addOutputLine(text, type = 'system') {
    const line = document.createElement('div');
    line.className = `output-line ${type}`;
    line.textContent = text;
    
    terminalOutput.appendChild(line);
    
    // Scroll vers le bas
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Ajout d'une ligne avec effet de frappe automatique
function addOutputLineWithTypewriter(text, type = 'system', speed = 50) {
    if (!terminalOutput) return;
    
    const outputLine = document.createElement('div');
    outputLine.className = `output-line ${type}`;
    terminalOutput.appendChild(outputLine);
    
    let index = 0;
    const typewriter = setInterval(() => {
        if (type === 'command') {
            outputLine.innerHTML = `<span class="command-prefix">$</span> ${text.substring(0, index + 1)}`;
        } else {
            outputLine.textContent = text.substring(0, index + 1);
        }
        
        index++;
        
        if (index >= text.length) {
            clearInterval(typewriter);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }, speed);
}

// Gestion des raccourcis clavier
document.addEventListener('keydown', function(e) {
    // Ctrl + L pour effacer le terminal
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        clearTerminal();
    }
    
    // Ctrl + C pour interrompre (si implémenté)
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        if (isAuthenticated) {
            addOutputLine('^C', 'system');
            addOutputLine('admin@secure-server:' + currentPath + '$ ', 'command');
        }
    }
});

// Gestion de la fermeture de la page
window.addEventListener('beforeunload', function() {
    if (isAuthenticated) {
        addOutputLine('Session fermée', 'system');
    }
});
