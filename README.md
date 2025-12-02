# 🛡️ SecureMail Sentinel
### Sistema automatizado de detección, clasificación y mitigación de correos potencialmente maliciosos usando Wazuh SIEM + Shuffle SOAR + Gmail API

---

## 📌 Descripción general

**SecureMail Sentinel** es un sistema de automatización de seguridad (SOAR + SIEM) diseñado para:

- Detectar comportamientos sospechosos en buzones corporativos
- Analizar eventos del correo electrónico a través de la **Gmail API**
- Clasificar correos potencialmente maliciosos (phishing, spam, spoofing, adjuntos sospechosos…)
- Ejecutar playbooks automáticos de defensa con **Shuffle SOAR**
- Mover mensajes maliciosos directamente a **SPAM**
- Generar alertas en **Wazuh** para monitorización y auditoría
- Consolidar logs de análisis y acciones de respuesta en **OpenSearch**

Este proyecto proporciona una infraestructura completa que combina **detección, automatización y respuesta**, ofreciendo un sistema modular y escalable.

---

### 🧱 Arquitectura del sistema

                 Gmail API
                      ↓
          [ SecureMail Collector ]
                      ↓
                  Wazuh SIEM
                      ↓
                OpenSearch DB
                      ↓
              Wazuh Dashboard UI
                      ↓
      ┌───────────────────────────────────┐
      │            Shuffle SOAR           │
      │  - Playbooks automáticos          │
      │  - Clasificación de emails        │
      │  - Envío automático a SPAM        │
      │  - Integraciones externas         │
      └───────────────────────────────────┘

---

## 🧩 Funcionalidades clave

### ✔ Recolección de eventos desde Gmail
- Uso de **Gmail API**
- Lectura de mensajes sospechosos
- Extracción de señales:
  - URLs maliciosas
  - Adjuntos ejecutables
  - Spoofing de dominios
  - Indicadores de phishing
- Envío de logs a Wazuh para indexación

### ✔ Motor SIEM con Wazuh
- Procesa logs de Gmail
- Aplica reglas de seguridad
- Genera alertas y eventos
- Envia datos a OpenSearch para análisis

### ✔ Dashboards centralizados con Wazuh Dashboard
- Visualización de:
  - Incidentes de phishing
  - Intentos de spoofing
  - Correos movidos a SPAM por SOAR
  - Detección de adjuntos peligrosos

### ✔ Automatización SOAR con Shuffle
- Playbook principal:
  1. Recibe alerta de Wazuh
  2. Consulta Gmail API
  3. Clasifica el correo
  4. Mueve el mensaje a SPAM
  5. Genera registro de auditoría
  6. Notifica al analista o canal (Slack, Discord, email…)

- Playbooks adicionales:
  - Indicadores de compromiso
  - Enriquecimiento de amenazas
  - Bloqueo de remitentes

---

## 🏗 Infraestructura Docker Compose

El sistema consta de dos stacks:

### ▶ Stack SIEM (Wazuh + OpenSearch)
Archivo: `docker-compose-wazuh.yml`

### ▶ Stack SOAR (Shuffle + MongoDB)
Archivo: `docker-compose-shuffle.yml`

Se ejecutan por separado y se comunican vía API/HTTP.

---

## 🚀 Arranque
```
### 1️⃣ Clonar el repositorio
bash
git clone https://github.com/tuusuario/securemail-sentinel.git
cd securemail-sentinel/infra

### 2️⃣ **Levantar el SIEM (Wazuh + OpenSearch)**
docker compose -f docker-compose-wazuh.yml up -d


Acceso al dashboard:
➡ http://localhost:5601

### 3️⃣ **Levantar el SOAR (Shuffle)**
docker compose -f docker-compose-shuffle.yml up -d


Acceso Shuffle Frontend:
➡ http://localhost:3002


### 🧪 **Cómo opera en producción
**
- Gmail envía logs → Wazuh
- Wazuh detecta actividad sospechosa
- Wazuh genera una alerta
- Shuffle SOAR recibe la alerta
- Shuffle consulta el correo en Gmail
- Si es malicioso → mueve el mensaje a SPAM automáticamente
- Se genera auditoría y notificación
- Todo queda indexado en OpenSearch

### 📊** Dashboards SIEM incluidos**

- Phishing detection overview
- Malicious attachments
- Sender reputation
- Spoofing indicators
- Automatic actions history
- SOAR actions timeline
