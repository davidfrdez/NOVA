using Microsoft.Extensions.DependencyInjection;
using Portal.Application.Interfaces;
using Portal.Application.Services;
using Portal.Infrastructure.Persistence;
using Portal.Infrastructure.Services;

namespace Portal.Infrastructure.Extensions;

/// <summary>
/// Registers infrastructure and application services in the dependency injection container.
/// </summary>
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPortalServices(this IServiceCollection services)
    {
        services.AddSingleton<IApiRepository, InMemoryApiRepository>();
        services.AddSingleton<ApiCatalogService>();
        services.AddHttpClient("api-test");
        services.AddSingleton<IEndpointTester, HttpEndpointTester>();
        return services;
    }
}
