#  Triple A 

Triple A est une application légère de surveillance système (monitoring) développée en Python. Elle permet de visualiser en temps réel l'état des ressources de votre machine (CPU, RAM) ainsi que les processus en cours d'exécution via une interface web moderne.

## Fonctionnalités

* **Informations Système :** Affichage du nom de la machine, de l'OS, de l'adresse IP, de l'heure de démarrage et de l'uptime.
* **Monitoring des Ressources :**
    * Jauges visuelles pour l'utilisation du CPU et de la RAM.
    * Détails sur la fréquence CPU, le nombre de cœurs et la mémoire totale/utilisée.
* **Gestion des Processus :**
    * Liste complète des processus actifs avec leur consommation (CPU/RAM).
    * Mise en avant du **Top 3** des processus les plus gourmands.
* **Deux modes de fonctionnement :**
    * **Serveur Web (Flask) :** Mise à jour en temps réel via une API.
    * **Générateur Statique :** Création d'un rapport HTML instantané ("snapshot").

## Structure du Projet

- app.py               : Application Flask (Serveur Web dynamique)
- monitor.py           : Script de génération de rapport statique
- Nomenclature.txt     : Documentation des variables utilisées
- templates/index.html : Template HTML (Jinja2) de l'interface
- static/css/index.css : Styles de la page (Dark mode, responsive)
- static/js/Gauge.js   : Script de gestion des jauges et rafraîchissement API
- www/                 : Dossier de sortie pour le mode statique

## Prérequis

Assurez-vous d'avoir Python 3.x installé. Vous aurez besoin des bibliothèques suivantes :
- psutil
- flask
- jinja2

Commande d'installation :
pip install psutil flask jinja2

##  Utilisation

### Option 1 : Mode Serveur Web 
Ce mode lance un serveur web local qui permet de consulter les statistiques en temps réel.
1. Lancez l'application : python app.py
2. Ouvrez votre navigateur sur : http://localhost:5000

### Option 2 : Mode Rapport Statique
Ce mode génère un fichier HTML unique (www/index.html) contenant une photo de l'état du système à l'instant T.
1. Lancez le script : python monitor.py
2. Ouvrez le fichier généré dans 'www/index.html'.

##  Personnalisation

Le design est géré dans 'static/css/index.css' (thème Dark Mode).
Les correspondances de variables sont listées dans 'Nomenclature.txt'.

##  
projet de Nathan, Guilllaume, Floriant, Ludovic
