from flask import Flask, render_template
import psutil
import time
import datetime
import platform
import socket

app = Flask(__name__)

@app.route("/")
def index():

    # CPU / RAM
    heart_cpu = psutil.cpu_count()
    
    # CORRECTION IMPORTANTE: Récupération du pourcentage CPU sans bloquer la route pendant 1 seconde.
    psutil.cpu_percent() # Primes la mesure (premier appel)
    time.sleep(0.1)      # Attend 100 millisecondes (au lieu de 1 seconde)
    percent_cpu = psutil.cpu_percent() # Récupère la mesure (deuxième appel)
    
    freq_cpu = psutil.cpu_freq().current

    memoire = psutil.virtual_memory()
    full_ram = round(memoire.total / (1024**3), 2)
    use_ram = round(memoire.used / (1024**3), 2)
    percent_ram = memoire.percent

    # SYSTEME
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

    # PROCESSUS
    liste_procs = []

    for p in psutil.process_iter():
        try:
            p_info = p.as_dict(attrs=['pid', 'name', 'cpu_percent', 'memory_percent'])
            if p_info['name']:
                liste_procs.append(p_info)
        # CORRECTION: Utilisation des exceptions spécifiques pour psutil (meilleure pratique)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

    # AJOUT: Tri de la liste complète par CPU décroissant (du plus consommateur au moins)
    liste_procs = sorted(liste_procs, key=lambda x: x['cpu_percent'], reverse=True)
    
    # Extraction du Top 3 CPU à partir de la liste déjà triée
    top_3_cpu = liste_procs[:3]
    
    # Tri du Top 3 RAM 
    top_3_ram = sorted(liste_procs, key=lambda x: x['memory_percent'], reverse=True)[:3]

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