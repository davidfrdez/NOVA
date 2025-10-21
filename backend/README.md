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
  packet/                   -> Caché local para paquetes NuGet y manifiesto offline.
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

## Restauración sin conexión

El directorio `packet/` contiene un manifiesto (`manifest.json`) con los paquetes NuGet
requeridos para compilar el backend fuera de línea: `Microsoft.Extensions.DependencyInjection.Abstractions` y
`Microsoft.Extensions.Http`, ambos en la versión `8.0.0`. Descarga las dependencias en un equipo con
internet usando el cliente de NuGet y cópialas a `backend/packet/`:

```bash
nuget install Microsoft.Extensions.DependencyInjection.Abstractions -Version 8.0.0 -OutputDirectory backend/packet
nuget install Microsoft.Extensions.Http -Version 8.0.0 -OutputDirectory backend/packet
```

Una vez en el entorno sin conexión, utiliza el `offline.nuget.config` incluido para forzar la restauración
contra el feed local:

```bash
DOTNET_OFFLINE_SOURCE=$(pwd)/backend/packet
dotnet restore backend/Portal.Backend.sln --configfile backend/packet/offline.nuget.config --source "$DOTNET_OFFLINE_SOURCE" --ignore-failed-sources
```

El archivo `backend/packet/README.md` detalla estos pasos y cómo limpiar la caché local al finalizar.

## Extensiones futuras sugeridas

- Persistencia en SQL Server o Cosmos DB.
- Integración con Azure AD para autenticación interna.
- Observabilidad (Serilog + OpenTelemetry).
- Programación de pruebas recurrentes y alertas vía Teams/Email.
