using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Portal.Api.Extensions;
using Portal.Application.DTOs;
using Portal.Application.Services;
using Portal.Domain.Entities;

namespace Portal.Api.Features;

/// <summary>
/// Groups minimal API endpoints responsible for managing the catalog.
/// </summary>
public static class ApiCatalogEndpoints
{
    private const string Tag = "API Catalog";

    public static IEndpointRouteBuilder MapApiCatalogEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("/api/catalog").WithTags(Tag);

        group.MapGet("", async ([FromServices] ApiCatalogService service, CancellationToken ct) =>
        {
            var apis = await service.ListAsync(ct);
            return Results.Ok(apis.Select(api => new
            {
                api.Id,
                api.Name,
                api.Owner,
                BaseUrl = api.BaseUrl.ToString(),
                ProductionUrl = api.ProductionUrl?.ToString(),
                api.TestPort,
                api.Description,
                Endpoints = api.Endpoints,
                Tests = api.TestPayloads.Select(test => new
                {
                    test.Id,
                    test.EndpointName,
                    test.HttpMethod,
                    test.RelativePathOverride,
                    test.CreatedOn,
                    test.JsonBody
                })
            }));
        })
        .WithName("ListApis")
        .WithSummary("Obtiene el catálogo completo de APIs internas.");

        group.MapPost("", async Task<Results<Created<ApiDefinition>, ValidationProblem>> ([FromBody] ApiRegistrationRequest request, [FromServices] ApiCatalogService service, CancellationToken ct) =>
        {
            if (!MiniValidator.TryValidate(request, out var errors))
            {
                return TypedResults.ValidationProblem(errors);
            }

            var created = await service.RegisterAsync(request, ct);
            return TypedResults.Created($"/api/catalog/{created.Id}", created);
        })
        .WithName("RegisterApi")
        .WithSummary("Registra una nueva API dentro del catálogo interno.");

        group.MapPost("/{id:guid}/tests", async Task<Results<Created<ApiTestPayload>, NotFound, ValidationProblem>> (Guid id, [FromBody] ApiTestRequest request, [FromServices] ApiCatalogService service, CancellationToken ct) =>
        {
            if (!MiniValidator.TryValidate(request, out var errors))
            {
                return TypedResults.ValidationProblem(errors);
            }

            try
            {
                var payload = await service.AddTestPayloadAsync(id, request, ct);
                return TypedResults.Created($"/api/catalog/{id}/tests/{payload.Id}", payload);
            }
            catch (KeyNotFoundException)
            {
                return TypedResults.NotFound();
            }
        })
        .WithName("SaveTestPayload")
        .WithSummary("Guarda un JSON de prueba asociado a un endpoint específico.");

        group.MapPost("/{id:guid}/tests/{payloadId:guid}/execute", async Task<Results<Ok<ApiTestExecutionResult>, NotFound>> (Guid id, Guid payloadId, [FromServices] ApiCatalogService service, CancellationToken ct) =>
        {
            var result = await service.ExecuteAsync(id, payloadId, ct);
            if (result is null)
            {
                return TypedResults.NotFound();
            }

            return TypedResults.Ok(result);
        })
        .WithName("ExecuteTest")
        .WithSummary("Ejecuta el JSON de prueba contra el endpoint real y devuelve la respuesta.");

        return builder;
    }
}
