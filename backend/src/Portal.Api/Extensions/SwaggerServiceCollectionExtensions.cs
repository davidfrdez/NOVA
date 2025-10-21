using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace Portal.Api.Extensions;

/// <summary>
/// Contains the customised Swagger configuration used across the portal.
/// </summary>
public static class SwaggerServiceCollectionExtensions
{
    public static IServiceCollection AddCustomSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Portal Interno de APIs",
                Version = "v1",
                Description = "Documentación unificada de APIs internas - MasOrange España"
            });
        });

        return services;
    }
}
