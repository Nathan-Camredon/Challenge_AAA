import psutil 
import time 
import datetime
import platform
import socket

#--------------------------------------------------------------
#       CPU & MEMOIRE
#--------------------------------------------------------------
heart_cpu = psutil.cpu_count()
percent_cpu = psutil.cpu_percent(interval=1)
freq_cpu = psutil.cpu_freq().current

memoire = psutil.virtual_memory() 
full_ram = round(memoire.total / (1024**3), 2)
use_ram = round(memoire.used / (1024**3), 2)
percent_ram = memoire.percent

#--------------------------------------------------------------
#       SYSTEME
#--------------------------------------------------------------
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

#--------------------------------------------------------------
#--------------------------------------------------------------
#       PROCESSUS (Version corrigée et robuste)
#--------------------------------------------------------------
liste_procs = []

# On demande poliment à Windows les infos
for p in psutil.process_iter():
    try:
        # On récupère les infos une par une
        p_info = p.as_dict(attrs=['pid', 'name', 'cpu_percent', 'memory_percent'])
        
        # Si le nom existe, on l'ajoute à la liste
        if p_info['name']: 
            liste_procs.append(p_info)
    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
        # Si Windows dit "Non", on passe au suivant sans planter
        pass

# Tri 1 : Les 3 plus gros consommateurs de CPU
top_3_cpu = sorted(liste_procs, key=lambda x: x['cpu_percent'], reverse=True)[:3]

# Tri 2 : Les 3 plus gros consommateurs de RAM
top_3_ram = sorted(liste_procs, key=lambda x: x['memory_percent'], reverse=True)[:3]

#--------------------------------------------------------------
#       AFFICHAGE
#--------------------------------------------------------------
print("-" * 40)
print(f"Machine : {name_machine} ({name_os} {name_systeme})")
print(f"IP : {ip_adress}")
print(f"Démarré le : {start_systeme}")
print(f"Uptime : {uptime_systeme} heures")
print(f"Utilisateurs : {name_user}")
print("-" * 40)
print(f"Coeurs CPU : {heart_cpu} | Fréquence : {freq_cpu}Mhz | Usage : {percent_cpu}%")
print(f"RAM : {use_ram}GB / {full_ram}GB ({percent_ram}%)")

print("-" * 40)
print("### TOP 3 CPU (Processeur) ###")
if not top_3_cpu:
    print(" (Aucune donnée accessible - Lancez en Admin)")
else:
    for proc in top_3_cpu:
        print(f" - {proc['name']:<25} : {proc['cpu_percent']}%")

print("-" * 40)
print("### TOP 3 RAM (Mémoire) ###")
if not top_3_ram:
    print(" (Aucune donnée accessible)")
else:
    for proc in top_3_ram:
        ram_display = round(proc['memory_percent'], 2)
        print(f" - {proc['name']:<25} : {ram_display}%")
print("-" * 40)