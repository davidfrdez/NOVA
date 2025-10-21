# Frontend - Portal Interno de APIs

Aplicación React + Vite orientada a ofrecer una experiencia ligera, corporativa y personalizable. Utiliza Mantine UI y un esquema de color oscuro inspirado en MasOrange España.

## Scripts

- `npm install` — Instala dependencias.
- `npm run dev` — Levanta el entorno local en `http://localhost:5173`.
- `npm run build` — Genera el bundle de producción.
- `npm run preview` — Previsualiza el bundle generado.

> **Proxy**: Durante desarrollo se proxian las llamadas `/api` al backend en `http://localhost:5008`.

## Funcionalidades

- Registro de APIs con múltiples endpoints.
- Visualización de metadatos y documentación resumida.
- Gestión de JSONs de prueba por endpoint.
- Ejecución directa de pruebas contra el backend y visualización de la respuesta.

## Próximos pasos sugeridos

- Autenticación corporativa (Azure AD / Keycloak).
- Alertas de cambio de contrato (dif entre payloads históricos).
- Integración con dashboards de observabilidad (Grafana, Kibana).
