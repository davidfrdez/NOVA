# Plataforma Interna de Gestión de APIs

Solución base para un portal corporativo ligero inspirado en Backstage, desarrollado con .NET 8 (Minimal APIs + Clean Architecture) y React + Vite. Permite registrar APIs internas, almacenar payloads de prueba y ejecutar tests en caliente desde la interfaz.

## Estructura del repositorio

```
NOVA/
├── backend/
│   ├── README.md
│   ├── examples/
│   │   ├── sample-api-registration.json
│   │   └── sample-endpoint-test.json
│   └── src/
│       ├── Portal.Api/
│       ├── Portal.Application/
│       ├── Portal.Domain/
│       └── Portal.Infrastructure/
└── frontend/
    └── portal-app/
        ├── README.md
        ├── index.html
        └── src/
```

## Conexión Frontend ↔ Backend

- El backend expone endpoints REST bajo `/api/catalog` y documentación Swagger en `/swagger`.
- El frontend consume dichas rutas mediante un `apiClient` basado en Axios. En desarrollo, Vite proxia `/api` hacia `http://localhost:5008` (configurable en `vite.config.ts`).
- Para ejecutar pruebas, el frontend guarda payloads JSON via `POST /api/catalog/{id}/tests` y lanza ejecuciones contra `POST /api/catalog/{id}/tests/{payloadId}/execute`.

## Flujo de trabajo recomendado

1. Iniciar el backend (`dotnet run` desde `backend/src/Portal.Api`).
2. Levantar el frontend (`npm install && npm run dev` dentro de `frontend/portal-app`).
3. Registrar una API rellenando el formulario, incluyendo endpoints relevantes.
4. Crear JSONs de prueba para cada endpoint crítico y guardarlos.
5. Ejecutar las pruebas desde el panel lateral y analizar la respuesta en tiempo real.
6. Revisar la documentación generada automáticamente en Swagger UI.

## Mejoras opcionales sugeridas

- Autenticación corporativa (Azure AD / OAuth2) para restringir accesos.
- Persistencia en bases de datos relacionales o documentales.
- Auditoría y métricas con Serilog + Application Insights.
- Dashboard de estado con salud de endpoints y últimas ejecuciones.
