# Dashboards SIEM – Proyecto Anti-Phishing Gmail

## 1. Objetivo
Diseñar dashboards en Wazuh para:
- Visualizar eventos de phishing.
- Analizar tendencias.
- Monitorear actividad sospechosa.
- Facilitar el trabajo de analistas.

---

## 2. Fuentes de Datos
Los datos provienen de:
- Logs generados por scripts Python.
- Alertas de Wazuh.
- Logs del SOAR enviados nuevamente al SIEM.
- Información de enriquecimiento IOC.

Campos clave:
- email_id
- sender
- domain
- urls_detected
- risk_score
- dkim/spf/dmarc status
- virustotal hits
- acción del SOAR

---

## 3. Dashboards Propuestos

### 3.1 Dashboard: “Phishing Overview”
Métricas:
- Total de correos analizados por día.
- Total de correos clasificados como phishing.
- Distribución por score.
- Estado de autenticación del correo:
  - SPF Pass/Fail
  - DKIM Valid/None
  - DMARC Align/Fail

Gráficos recomendados:
- Línea: “Correos sospechosos por día”.
- Barras: “Top dominios maliciosos”.
- Pie: “Acciones tomadas por SOAR”.

---

### 3.2 Dashboard: “IOC Intelligence”
Métricas:
- Top URLs maliciosas.
- Top IPs reportadas en VT/OTX.
- Correlación de eventos repetidos.

Gráficos:
- Tabla dinámica con IOC enriquecidos.
- Mapa geométrico (si se quiere mostrar IP origen).

---

### 3.3 Dashboard: “User Exposure”
Permite evaluar riesgo por usuario.

Métricas:
- Correos sospechosos por receptor.
- Score promedio por usuario.
- Correos eliminados automáticamente.

---

### 3.4 Dashboard: “SOAR Activity”
Reúne acciones automatizadas.

Indicadores:
- Total de correos movidos a spam.
- Total de correos eliminados.
- Tiempo medio de respuesta.
- Incidentes generados.

---

## 4. Reglas de Alerta en Wazuh
Reglas recomendadas:

### Regla 1: Score alto

IF risk_score >= 5 THEN alert_level = high


### Regla 2: SPF y DKIM fallidos + enlace sospechoso

IF spf=fail AND dkim=fail AND url_count>=1 THEN flag=phishing


### Regla 3: IOC positivo en VT

IF vt_positives >= 1 THEN alert_level = critical


---

## 5. Buenas Prácticas
- Mantener dashboards simples (máx 10 widgets).
- Evitar KPIs redundantes.
- Incluir enlaces directos al SOAR o a incidentes.
- Mantener colores estándar de riesgo.

---

## 6. Futuras Extensiones
- Dashboard de correlación con sandbox (Cuckoo).
- Visualización de reputación de dominios.
- Alertas predictivas utilizando ML.
