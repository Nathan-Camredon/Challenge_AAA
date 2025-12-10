from flask import Flask, render_template
import psutil
import time
import datetime
import platform
import socket

#----------------------------------------------------------------------------
#                   INITIALISATION DE L'APPLICATION
#----------------------------------------------------------------------------
app = Flask(__name__) # Création de l'instance Flask

@app.route("/")
def index():

    #----------------------------------------------------------------------------
    #                       COLLECTE CPU / RAM
    #----------------------------------------------------------------------------
    heart_cpu = psutil.cpu_count()
    
    psutil.cpu_percent()
    time.sleep(0.1)      # permet de mettre une petite pause pour eviter que ça plante (mesure sur 0.1s)
    percent_cpu = psutil.cpu_percent() # Récupère la mesure 
    
    freq_cpu = psutil.cpu_freq().current

    memoire = psutil.virtual_memory()
    full_ram = round(memoire.total / (1024**3), 2) # RAM totale en GB
    use_ram = round(memoire.used / (1024**3), 2)   # RAM utilisée en GB
    percent_ram = memoire.percent                  # Pourcentage d'utilisation RAM

    #----------------------------------------------------------------------------
    #                       COLLECTE SYSTEME
    #----------------------------------------------------------------------------
    name_machine = platform.node()              # Nom de la machine
    name_os = platform.system()                 # Nom du système d'exploitation (ex: Windows, Linux)
    name_systeme = platform.release()           # Version du système
    ip_adress = socket.gethostbyname(socket.gethostname()) # Adresse IP locale

    boot_time_timestamp = psutil.boot_time()
    heure_actuel_timestamp = time.time()
    uptime_secondes = heure_actuel_timestamp - boot_time_timestamp
    uptime_systeme = round(uptime_secondes / 3600, 2) # Temps écoulé depuis le démarrage (en heures)

    start_systeme = datetime.datetime.fromtimestamp(boot_time_timestamp) # Heure de démarrage du système

    name_user = len(psutil.users()) # Nombre d'utilisateurs connectés

    #----------------------------------------------------------------------------
    #                       COLLECTE PROCESSUS
    #----------------------------------------------------------------------------
    liste_procs = [] #liste des processus

    for p in psutil.process_iter():
        try:
            p_info = p.as_dict(attrs=['pid', 'name', 'cpu_percent', 'memory_percent'])
            
            # Ignorer le processus inactif du système 
            if p_info['name'] == 'System Idle Process':
                continue
            
            if p_info['name']:
                liste_procs.append(p_info) # Ajout du processus à la liste
        
        # Gestion des erreurs potentielles lors de la lecture d'un processus
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass


    # Tri de la liste complète par CPU (du plus au moins consommateur)
    liste_procs = sorted(liste_procs, key=lambda x: x['cpu_percent'], reverse=True)
    
    # Récupération du top 3 des processus par utilisation CPU
    top_3_cpu = liste_procs[:3]
    
    # Tri du Top 3 par utilisation RAM (séparé du tri CPU)
    top_3_ram = sorted(liste_procs, key=lambda x: x['memory_percent'], reverse=True)[:3]

#----------------------------------------------------------------------------
#                       RENDU HTML (JINJA2)
#----------------------------------------------------------------------------

    return render_template("index.html",
        name_machine=name_machine,
        name_os=name_os,
        name_systeme=name_systeme,
        ip_adress=ip_adress,
        start_systeme=start_systeme,
        uptime_systeme=uptime_systeme,
        name_user=name_user,
        heart_cpu=heart_cpu,
        freq_cpu=freq_cpu,
        percent_cpu=percent_cpu,
        use_ram=use_ram,
        full_ram=full_ram,
        percent_ram=percent_ram,
        list_proc=liste_procs,
        list_cpu=top_3_cpu, # Top 3 CPU pour le débogage/affichage spécifique
        list_ram=top_3_ram, # Top 3 RAM pour l'affichage spécifique
        top_3=top_3_cpu     # Top 3 principal (utilisé dans la section Top 3 du template)
    )

if __name__ == "__main__":
    # Démarrage de l'application Flask
    app.run(host="0.0.0.0", port=5000)