# 🚀 MVW | Système de Sécurité Terminal

Un terminal administrateur interactif et réaliste avec authentification et gestion de projets, conçu pour simuler une interface de sécurité professionnelle.

## 📋 Description

Ce projet simule un terminal administrateur Linux avec une interface authentique, incluant :
- **Terminal interactif** avec commandes réalistes
- **Système d'authentification** avec gestion des tentatives
- **Interface de gestion de projets** 
- **Détection automatique** des informations système
- **Effets visuels** et animations cinématographiques

## 🎯 Fonctionnalités Principales

### 🔐 Système d'Authentification
- **Mot de passe flexible** : "moi" (accepte toutes les variations de casse et espaces)
- **Gestion des tentatives** : 3 essais maximum avant verrouillage
- **Verrouillage temporaire** : 1 minute de blocage après échec
- **Messages d'interrogation** : Questionne l'identité à chaque tentative échouée

### 💻 Terminal Interactif
- **Commandes Linux réalistes** : `ls`, `cd`, `pwd`, `help`, etc.
- **Historique des commandes** avec navigation flèches haut/bas
- **Interface authentique** : Prompt root, informations système
- **Détection automatique** : OS, navigateur, résolution, géolocalisation

### 🌍 Informations Système
- **Détection automatique** de l'environnement utilisateur
- **Informations météo** en temps réel (via API wttr.in)
- **Géolocalisation** et données de localisation
- **Statistiques système** : CPU, RAM, uptime, etc.

### �� Gestion de Projets
- **Interface dédiée** pour la gestion des projets
- **Navigation fluide** entre le terminal et les projets
- **Interface moderne** et responsive

## ��️ Technologies Utilisées

- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **APIs externes** : wttr.in (météo), géolocalisation navigateur
- **Polices** : Consolas, Courier Prime (style terminal)
- **Responsive Design** : Compatible mobile et desktop

## 📁 Structure du Projet

```
test/
├── index.html          # Page principale du terminal
├── script.js           # Logique principale et authentification
├── styles.css          # Styles du terminal
├── projects.html       # Interface de gestion des projets
├── projects.js         # Logique des projets
└── projects.css        # Styles des projets
```

## 🚀 Installation et Utilisation

### 1. Cloner le projet
```bash
git clone [URL_DU_REPO]
cd test
```

### 2. Ouvrir dans un navigateur
```bash
# Ouvrir index.html dans votre navigateur préféré
# Ou utiliser un serveur local
python -m http.server 8000
# Puis aller sur http://localhost:8000
```

### 3. Authentification
- **Mot de passe** : `moi` (ou `MOI`, `Moi`, etc.)
- **Utilisateur** : `admin`
- **Système** : Ubuntu 22.04 LTS

## 🎮 Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `help` | Affiche l'aide disponible |
| `clear` | Efface l'écran du terminal |
| `ls` | Liste les fichiers du répertoire |
| `pwd` | Affiche le répertoire actuel |
| `cd` | Change de répertoire |
| `projects` | Accès à la gestion des projets |
| `status` | Statut du système |
| `whoami` | Informations utilisateur |
| `date` | Date et heure actuelles |
| `exit` | Déconnexion |

##  Configuration

### Modifier le mot de passe
Dans `script.js`, ligne 2 :
```javascript
const SYSTEM_CONFIG = {
    password: 'moi', // Changer ici
    // ... autres paramètres
};
```

### Ajuster les tentatives
```javascript
maxAttempts: 3,        // Nombre de tentatives
lockoutTime: 60000,    // Temps de verrouillage (ms)
```

##  Fonctionnalités Avancées

### Détection Automatique
- **Système d'exploitation** : Windows, macOS, Linux
- **Navigateur** : Chrome, Firefox, Safari, Edge
- **Résolution d'écran** et profondeur de couleur
- **Mémoire** et cœurs CPU (si disponibles)

### Sécurité
- **Verrouillage progressif** après échecs
- **Timer de déverrouillage** avec compte à rebours
- **Messages d'alerte** et notifications
- **Gestion des sessions** et déconnexion

### Interface Utilisateur
- **Design terminal authentique** avec couleurs réalistes
- **Animations de frappe** automatique
- **Effets visuels** et transitions fluides
- **Responsive design** pour tous les écrans

##  Dépannage

### Problèmes courants
1. **Géolocalisation bloquée** : Autoriser l'accès dans le navigateur
2. **API météo indisponible** : Utilisation de données simulées
3. **Styles non chargés** : Vérifier les chemins des fichiers CSS

### Compatibilité
- **Navigateurs** : Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Systèmes** : Windows 10+, macOS 10.14+, Linux (toutes distributions)

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

##  Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## ‍💻 Auteur

**MVW** - Développeur du système de sécurité

## 🙏 Remerciements

- **Ubuntu** pour l'inspiration du design terminal
- **wttr.in** pour l'API météo gratuite
- **Google Fonts** pour les polices de caractères

---

⭐ **N'oubliez pas de donner une étoile au projet si vous l'aimez !**
```

Ce README fournit une documentation complète de votre projet, incluant :

- **Description détaillée** des fonctionnalités
- **Instructions d'installation** et d'utilisation
- **Documentation des commandes** disponibles
- **Guide de configuration** et personnalisation
- **Informations techniques** et de compatibilité
- **Guide de dépannage** pour les problèmes courants
- **Instructions de contribution** pour d'autres développeurs

Le README est structuré de manière professionnelle avec des emojis pour améliorer la lisibilité et donner un aspect moderne au projet.
