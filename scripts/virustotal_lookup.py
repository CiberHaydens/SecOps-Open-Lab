# ioc_lookup.py
import requests
import time
import os
from dotenv import load_dotenv

# Cargar .env
load_dotenv()

VT_API_KEY = os.getenv("VT_API_KEY")

VT_UPLOAD_URL = "https://www.virustotal.com/api/v3/files"
VT_ANALYSIS_URL = "https://www.virustotal.com/api/v3/analyses/"




def vt_upload_file(file_bytes, filename):
    """
    Sube un archivo a VirusTotal y devuelve el analysis_id.
    """
    files = {
        "file": (filename, file_bytes)
    }

    headers = {
        "x-apikey": VT_API_KEY
    }

    resp = requests.post(VT_UPLOAD_URL, headers=headers, files=files)

    if resp.status_code != 200:
        print("[VT] Error al subir archivo:", resp.text)
        return None

    return resp.json()["data"]["id"]  # analysis_id


def vt_get_analysis(analysis_id, max_wait=60):
    """
    Consulta el estado del análisis hasta que termine o hasta max_wait segundos.
    Devuelve el reporte final o None si no termina.
    """
    headers = {"x-apikey": VT_API_KEY}
    waited = 0
    interval = 3  # segundos

    while waited < max_wait:
        resp = requests.get(VT_ANALYSIS_URL + analysis_id, headers=headers)
        data = resp.json()
        status = data["data"]["attributes"]["status"]

        if status == "completed":
            return data

        print(f"[VT] Analizando... estado: {status}")
        time.sleep(interval)
        waited += interval

    print("[VT] Tiempo de espera máximo alcanzado. El análisis puede estar todavía en cola.")
    return None

def vt_analyze_file(file_bytes, filename):
    """
    Subir → Esperar resultado → Retornar análisis completo.
    """
    analysis_id = vt_upload_file(file_bytes, filename)

    if not analysis_id:
        return None

    print(f"[VT] Archivo enviado. Analysis ID: {analysis_id}")

    report = vt_get_analysis(analysis_id)
    return report