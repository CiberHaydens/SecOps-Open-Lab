import pickle
import time
import base64
import os

from email import message_from_bytes
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def gmail_auth():
    """Autenticación Gmail API."""
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as t:
            creds = pickle.load(t)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES
            )
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as t:
            pickle.dump(creds, t)
    service = build('gmail', 'v1', credentials=creds)
    return service

def fetch_email_parts(service, msg_id):
    """
    Obtiene las partes de un correo (asunto, cuerpo, adjuntos).
    """
    message = service.users().messages().get(userId='me', id=msg_id, format='full').execute()
    headers = message['payload']['headers']
    subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'Sin asunto')
    
    body = ''
    attachments = []
    
    if 'parts' in message['payload']:
        for part in message['payload']['parts']:
            if part['mimeType'] == 'text/plain':
                if 'data' in part['body']:
                    body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
            elif part['mimeType'].startswith('application/') or part['mimeType'].startswith('image/'):
                if 'filename' in part and part['filename']:
                    attachment_id = part['body']['attachmentId']
                    att_data = service.users().messages().attachments().get(
                        userId='me', messageId=msg_id, id=attachment_id
                    ).execute()
                    file_data = base64.urlsafe_b64decode(att_data['data'])
                    attachments.append({
                        'filename': part['filename'],
                        'data': file_data
                    })
    elif 'body' in message['payload']:
        if 'data' in message['payload']['body']:
            body = base64.urlsafe_b64decode(message['payload']['body']['data']).decode('utf-8')
    
    return subject, body, attachments

def watch_emails():
    """Escucha nuevos correos y llama a email_processor."""
    from email_processor import process_email  # Importación local para evitar circular import
    
    service = gmail_auth()
    profile = service.users().getProfile(userId="me").execute()
    last_history_id = profile["historyId"]

    print("🔍 Escuchando nuevos correos...")

    while True:
        history = service.users().history().list(
            userId="me",
            startHistoryId=last_history_id
        ).execute()

        if "history" in history:
            for event in history["history"]:
                if "messagesAdded" in event:
                    for msg in event["messages"]:
                        msg_id = msg["id"]
                        process_email(service, msg_id)  # llamamos al processor

        last_history_id = history.get("historyId", last_history_id)
        time.sleep(5)

if __name__ == "__main__":
    watch_emails()