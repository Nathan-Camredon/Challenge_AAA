import psutil 
import time 
import datetime

nb_coeurs = psutil.cpu_count()
usage_cpu = psutil.cpu_percent(interval=1)
freq_cpu = psutil.cpu_freq().current

memoire = psutil.virtual_memory()
Pram = psutil.virtual_memory().percent


print(nb_coeurs, usage_cpu, freq_cpu)
print(memoire)