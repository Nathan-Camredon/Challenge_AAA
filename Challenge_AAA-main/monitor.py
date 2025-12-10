import psutil
import time
import datetime
import platform
import socket
from jinja2 import Environment, FileSystemLoader

# --------------------------------------------------------------
# CPU & MEMOIRE
# --------------------------------------------------------------
heart_cpu = psutil.cpu_count()
percent_cpu = psutil.cpu_percent(interval=1)
freq_cpu = psutil.cpu_freq().current

memoire = psutil.virtual_memory()
full_ram = round(memoire.total / (1024**3), 2)
use_ram = round(memoire.used / (1024**3), 2)
percent_ram = memoire.percent

# --------------------------------------------------------------
# SYSTEME
# --------------------------------------------------------------
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

# --------------------------------------------------------------
# PROCESSUS
# --------------------------------------------------------------
liste_procs = []

for p in psutil.process_iter():
    try:
        p_info = p.as_dict(attrs=['pid', 'name', 'cpu_percent', 'memory_percent'])
        if p_info['name']:
            liste_procs.append(p_info)
    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
        pass

top_3_cpu = sorted(liste_procs, key=lambda x: x['cpu_percent'], reverse=True)[:3]
top_3_ram = sorted(liste_procs, key=lambda x: x['memory_percent'], reverse=True)[:3]

# --------------------------------------------------------------
# LIAISON AVEC JINJA
# --------------------------------------------------------------

env = Environment(loader=FileSystemLoader("templates"))
template = env.get_template("index.html")

html_output = template.render(
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
    top_3=top_3_cpu  # tu peux choisir ce que tu veux afficher
)

# --------------------------------------------------------------
# SAUVEGARDE HTML
# --------------------------------------------------------------

with open("www/index.html", "w", encoding="utf-8") as f:
    f.write(html_output)

print("✔️ Page générée : www/index.html")