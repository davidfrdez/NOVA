# Backend - Portal Interno de APIs

Arquitectura orientada a dominios con proyectos separados para Domain, Application, Infrastructure y Api. Pensada para evolucionar hacia bases de datos persistentes y autenticación corporativa.

## Estructura

```
backend/
  Portal.Backend.sln        -> Solución de Visual Studio que referencia los cuatro proyectos.
  src/
    Portal.Domain/          -> Entidades de dominio y agregados (ApiDefinition, ApiEndpoint).
    Portal.Application/     -> Casos de uso, DTOs y servicios (ApiCatalogService).
    Portal.Infrastructure/  -> Implementaciones técnicas (repositorio en memoria, HttpClient tester).
    Portal.Api/             -> Minimal APIs en ASP.NET Core 8 + Swagger extendido.
  examples/                 -> JSON de ejemplo para registros y pruebas.
```

## Endpoints principales

- `GET /api/catalog` — Lista todas las APIs registradas.
- `POST /api/catalog` — Registra una nueva API. Cuerpo esperado similar a `examples/sample-api-registration.json`.
- `POST /api/catalog/{id}/tests` — Guarda un JSON de prueba (ver `examples/sample-endpoint-test.json`).
- `POST /api/catalog/{id}/tests/{payloadId}/execute` — Ejecuta la prueba contra el endpoint real.
- `GET /health` — Comprobación básica de estado del backend.

## Swagger personalizado

Se habilita mediante `AddCustomSwagger` en `Program.cs`, generando documentación bajo `Portal Interno de APIs v1`.

## Flujo recomendado

1. Registrar una API desde el frontend o vía `POST /api/catalog`.
2. Agregar payloads de prueba asociados a endpoints críticos.
3. Ejecutar las pruebas para validar conectividad y contratos.
4. Consultar Swagger UI para ver documentación generada automáticamente.

## Extensiones futuras sugeridas

- Persistencia en SQL Server o Cosmos DB.
- Integración con Azure AD para autenticación interna.
- Observabilidad (Serilog + OpenTelemetry).
- Programación de pruebas recurrentes y alertas vía Teams/Email.
