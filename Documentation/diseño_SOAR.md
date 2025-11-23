# Diseño del Sistema SOAR – Proyecto Anti-Phishing Gmail

## 1. Objetivo del SOAR
El SOAR se encarga de:
- Detectar eventos provenientes del SIEM.
- Automatizar la respuesta ante phishing.
- Normalizar alertas.
- Ejecutar acciones correctivas sin intervención humana o semiautomáticas.

Tecnología: **Shuffle SOAR (Open-Source)**.

---

## 2. Entradas del SOAR
El SOAR recibe información desde dos fuentes:

### 2.1 Eventos del SIEM Wazuh
Tipo: JSON vía Webhook/API.  
Contiene:
- score del análisis del correo
- indicadores extraídos
- datos del remitente
- reglas disparadas en Wazuh

### 2.2 Conexión directa con Gmail API
Acciones:
- Listar correos
- Mover correo a spam
- Eliminar correo
- Enviar respuesta automática al usuario

---

## 3. Playbooks del SOAR

### 3.1 Playbook 1: “Clasificación y Respuesta Automática”
**Desencadenante:** alerta del SIEM con score ≥ 3.

**Pasos:**
1. Recibir alerta Wazuh por webhook.
2. Leer ID del correo afectado.
3. Llamar a script API Python para:
   - validar indicadores
   - obtener metadata del correo
4. Evaluar score final.
5. Tomar decisión:

| Score | Acción |
|-------|--------|
| 0–2   | Enviar a revisión manual |
| 3–4   | Mover a SPAM + notificar |
| 5+    | Eliminar correo + registrar incidente |

6. Generar artefacto de incidente.
7. Guardar logs en almacenamiento interno.

---

### 3.2 Playbook 2: “Notificación al Usuario”
**Acción manual o automática desde Playbook 1.**

Flujo:
1. Formar mensaje:
   - posible phishing detectado
   - razones del análisis
   - recomendaciones
2. Enviar correo vía Gmail API.
3. Registrar acción en SIEM mediante webhook.

---

### 3.3 Playbook 3: “IOC Enrichment”
Para enriquecer indicadores en cada alerta.

Pasos:
1. Extraer IPs/URLs/domains.
2. Consultar APIs:
   - VirusTotal
   - AlienVault OTX
   - AbuseIPDB
3. Consolidar la información.
4. Generar un “Enriched IOC Report”.
5. Devolver resultado al Playbook principal.

---

### 3.4 Playbook 4: “Gestión del Ciclo de Vida del Incidente”
Incluye:
- Apertura de incidente.
- Actualización de estatus.
- Cierre automático.
- Envío a GitHub (issues) para documentación.

---

## 4. Diseño del Flujo General

[Wazuh Alert] --> [SOAR Trigger]
--> [IOC Enrichment]
--> [Decision Node]
| |
[Acción Suave] [Acción Fuerte]
| |
Notificación Eliminar correo
\ /
[Registrar incidente]


---

## 5. Tipos de Acciones Permitidas

### Acciones automáticas:
- Mover correo a spam.
- Consultar IOC.
- Generar incidente.
- Eliminar correo si score ≥ 5.

### Acciones semiautomáticas:
- Enviar notificación al usuario.
- Solicitar confirmación para correos ambiguos.

### Acciones manuales:
- Análisis avanzado.
- Forzar cierre de incidente.

---

## 6. Seguridad del SOAR
- Acceso al panel solo por VPN.
- API tokens guardados como secrets en Shuffle.
- Validación de entrada de Wazuh (hash + signature).
- Playbook firmado para asegurar integridad.

---

## 7. Métricas y KPIs SOAR
- Tiempo promedio de respuesta.
- Número de falsos positivos.
- Correos eliminados por score.
- IOCs más frecuentes.