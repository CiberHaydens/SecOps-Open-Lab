
# Arquitectura del Proyecto: SecOps Open Lab – Anti-Phishing en Gmail

## 1. Objetivo General
Diseñar un laboratorio colaborativo basado en herramientas open-source que permita:
- Analizar correos electrónicos recibidos desde Gmail.
- Detectar phishing mediante scripts y reglas de clasificación.
- Enviar eventos al SIEM (Wazuh).
- Ejecutar respuestas automáticas usando un SOAR (Shuffle).
- Trabajar en remoto mediante una red mesh VPN.
- Desarrollar habilidades de SecOps, scripting, automatización y diseño de pipelines.

---

## 2. Arquitectura General del Sistema

### Diagrama de Alto Nivel

     +---------------------+
     |   GitHub Repository |
     |  (scripts, playbooks,
     |    documentación)   |
     +----------+----------+
                |
        Colaboración remota
                |

+---------------------------------------------------+
| VPN Mesh |
| (Tailscale o alternativa OSS) |
+---------------------------------------------------+
| | |
+----+----+ +------+-------+ +----+------+
| Nodo 1 | | Nodo 2 | | Nodo 3 |
| Wazuh | | Shuffle SOAR | | Scripts |
| SIEM | | Workflows | | Python |
+---------+ +--------------+ +-----------+
|
| Gmail API (OAuth2)
|
+--------------+
| Gmail Account|
+--------------+


---

## 3. Componentes

### 3.1 Gmail API
- Se utiliza para leer correos en tiempo casi real.
- Requiere autenticación vía OAuth2.
- Los correos se procesan con un script Python que extrae cabeceras, URLs e indicadores.

### 3.2 Scripts Python
Funciones principales:
- `gmail_fetch.py`: obtiene correos.
- `header_parser.py`: analiza SPF/DKIM/DMARC.
- `phishing_analyzer.py`: asigna puntuación de riesgo.
- `ioc_lookup.py`: consulta VirusTotal / OTX.

### 3.3 SIEM: Wazuh
- Responsable de centralizar eventos.
- Registra logs de clasificación de correos.
- Genera alertas a partir de reglas propias.
- Guarda información histórica para dashboards.

### 3.4 SOAR: Shuffle
- Orquesta flujos automáticos.
- Ejecuta acciones basadas en reglas del análisis:
  - Mover correo a SPAM.
  - Eliminar correo.
  - Avisar al usuario.
  - Registrar incidente.
- Sus playbooks se conectan a scripts vía API.

### 3.5 VPN Mesh (Tailscale)
- Permite que todo el equipo acceda a:
  - Panel de Wazuh
  - Panel de Shuffle
  - API de scripts entre nodos
- Sin necesidad de compartir red local.

---

## 4. Flujo de Datos End-to-End

1. Gmail recibe un email.
2. `gmail_fetch.py` obtiene el correo.
3. El script extrae indicadores (URLs, dominios, IPs, adjuntos…).
4. Se ejecuta el analizador de phishing.
5. Se envía un registro JSON al SIEM Wazuh.
6. Wazuh genera alerta si supera cierto nivel.
7. Shuffle recibe el evento vía webhook/API.
8. El SOAR ejecuta el playbook correspondiente.
9. Shuffle toma una acción final (mover, eliminar o notificar).
10. Todo queda registrado en dashboards del SIEM.

---

## 5. Seguridad del Entorno
- Conexión protegida con TLS/mTLS entre servicios.
- Scripts firmados con certificados internos.
- Gestión segura de credenciales:
  - OAuth2 para Gmail.
  - API keys para herramientas externas.
  - Variables de entorno para secrets.
- Acceso a paneles solo a través de la VPN.

---

## 6. Diagrama de Componentes Internos

+-----------------------------------------------------------+
| SCRIPTS PYTHON |
| +----------------------+ +-----------------------------+ |
| | Extracción Gmail | | Análisis de Indicadores | |
| | gmail_fetch.py | | phishing_analyzer.py | |
| +----------------------+ +-----------------------------+ |
| | | |
+----------------|-----------------------------|------------+
|
| JSON event
v
+-----------------------------------------------------------+
| WAZUH SIEM |
| - Reglas de alerta |
| - Dashboards |
+-----------------------------------------------------------+
|
| Evento de alerta
v
+-----------------------------------------------------------+
| SHUFFLE SOAR |
| - Playbooks de respuesta |
| - Envío de acciones a Gmail / Notificaciones |
+-----------------------------------------------------------+


---

## 7. Requisitos Técnicos
- Docker / Docker Compose
- Python 3.10+
- Cuenta de Gmail con API habilitada
- Wazuh 4.x
- Shuffle SOAR CE
- Tailscale o Netmaker
- Git / GitHub

---

## 8. Futuras Mejoras
- Integración con sandbox de malware (Cuckoo).
- Clasificador ML para phishing.
- Base de datos de IOCs interna.
- Automatización de despliegue vía Ansible.
