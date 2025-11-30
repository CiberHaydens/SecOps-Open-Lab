from gmail_fetch import fetch_email_parts
# from header_parser import parse_headers
# from phishing_analyzer import phishing_score
from virustotal_lookup import vt_analyze_file

def process_email(service, msg_id):
    """
    Recibe el service de Gmail y el msg_id,
    obtiene partes del correo y ejecuta análisis completo.
    """
    # Obtener partes del correo
    subject, body, attachments = fetch_email_parts(service, msg_id)

    print("\n📩 Nuevo correo recibido:", subject)

    # 1️⃣ Analizar cabeceras
    # headers = parse_headers(body)

    # 2️⃣ Score phishing
    # score, reasons = phishing_score(headers, body)
    # print("🔎 Score phishing:", score, "Motivos:", reasons)

    # 3️⃣ Analizar adjuntos con VirusTotal
    for att in attachments:
        print(f"📎 Analizando adjunto: {att['filename']}")
        result = vt_analyze_file(att['data'], att['filename'])
        if result:
            stats = result["data"]["attributes"]["stats"]
            print("Resultado VirusTotal:", stats)