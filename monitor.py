from flask import Flask, render_template, jsonify
import psutil
import time
import datetime
import platform
import socket

#----------------------------------------------------------------------------
#                   INITIALISATION DE L'APPLICATION
#----------------------------------------------------------------------------

app = Flask(__name__)

@app.route("/api/stats")
def api_stats():
    #----------------------------------------------------------------------------
    #                       COLLECTE CPU / RAM
    #----------------------------------------------------------------------------

    cpu_percent = psutil.cpu_percent(interval=0.2)
    ram_percent = psutil.virtual_memory().percent

    return jsonify({            #jisonification des stats, 
        "cpu": cpu_percent,
        "ram": ram_percent
    })

@app.route("/")
def index():

    # CPU / RAM
    heart_cpu = psutil.cpu_count()
    
    psutil.cpu_percent()
    time.sleep(0.1)      # Delai
    percent_cpu = psutil.cpu_percent() # Récupère la mesure 
    
    freq_cpu = psutil.cpu_freq().current

    memoire = psutil.virtual_memory()
    full_ram = round(memoire.total / (1024**3), 2) #transition en GB 
    use_ram = round(memoire.used / (1024**3), 2)
    percent_ram = memoire.percent

     #----------------------------------------------------------------------------
    #                       COLLECTE SYSTEME
    #----------------------------------------------------------------------------

    name_machine = platform.node()
    name_os = platform.system()
    name_systeme = platform.release()
    ip_adress = socket.gethostbyname(socket.gethostname())

    boot_time_timestamp = psutil.boot_time()
    heure_actuel_timestamp = time.time()
    uptime_secondes = heure_actuel_timestamp - boot_time_timestamp
    uptime_systeme = round(uptime_secondes / 3600, 2)

    start_systeme = datetime.datetime.fromtimestamp(boot_time_timestamp)

    name_user = len(psutil.users())

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
        list_cpu=top_3_cpu,
        list_ram=top_3_ram,
        top_3=top_3_cpu
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)