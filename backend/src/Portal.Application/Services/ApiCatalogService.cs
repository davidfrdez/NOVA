using Portal.Application.DTOs;
using Portal.Application.Interfaces;
using Portal.Domain.Entities;

namespace Portal.Application.Services;

/// <summary>
/// Coordinates the registration, retrieval and testing of APIs inside the portal.
/// </summary>
public sealed class ApiCatalogService
{
    private readonly IApiRepository _repository;
    private readonly IEndpointTester _endpointTester;

    public ApiCatalogService(IApiRepository repository, IEndpointTester endpointTester)
    {
        _repository = repository;
        _endpointTester = endpointTester;
    }

    public async Task<ApiDefinition> RegisterAsync(ApiRegistrationRequest request, CancellationToken cancellationToken = default)
    {
        var definition = new ApiDefinition
        {
            Name = request.Name,
            Owner = request.Owner,
            BaseUrl = new Uri(request.BaseUrl),
            ProductionUrl = string.IsNullOrWhiteSpace(request.ProductionUrl) ? null : new Uri(request.ProductionUrl),
            TestPort = request.TestPort,
            Description = request.Description
        };

        foreach (var endpoint in request.Endpoints)
        {
            definition.AddEndpoint(endpoint);
        }

        return await _repository.AddAsync(definition, cancellationToken);
    }

    public Task<IReadOnlyCollection<ApiDefinition>> ListAsync(CancellationToken cancellationToken = default)
        => _repository.ListAsync(cancellationToken);

    public async Task<ApiTestPayload> AddTestPayloadAsync(Guid apiId, ApiTestRequest request, CancellationToken cancellationToken = default)
    {
        var payload = new ApiTestPayload
        {
            EndpointName = request.EndpointName,
            HttpMethod = request.HttpMethod,
            RelativePathOverride = request.RelativePathOverride,
            JsonBody = request.JsonBody
        };

        return await _repository.AddTestPayloadAsync(apiId, payload, cancellationToken);
    }

    public async Task<ApiTestExecutionResult?> ExecuteAsync(Guid apiId, Guid payloadId, CancellationToken cancellationToken = default)
    {
        var api = await _repository.GetByIdAsync(apiId, cancellationToken);
        if (api is null)
        {
            return null;
        }

        var payload = api.TestPayloads.FirstOrDefault(p => p.Id == payloadId);
        if (payload is null)
        {
            return null;
        }

        return await _endpointTester.ExecuteAsync(api, payload, cancellationToken);
    }
}
