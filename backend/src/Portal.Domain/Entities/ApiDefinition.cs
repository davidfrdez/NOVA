using System.Collections.ObjectModel;

namespace Portal.Domain.Entities;

/// <summary>
/// Aggregates the metadata required to manage an API inside the internal portal.
/// </summary>
public sealed class ApiDefinition
{
    private readonly List<ApiEndpoint> _endpoints = new();
    private readonly List<ApiTestPayload> _testPayloads = new();

    public Guid Id { get; init; } = Guid.NewGuid();

    public required string Name { get; init; }

    public required string Owner { get; init; }

    public required Uri BaseUrl { get; init; }

    public Uri? ProductionUrl { get; init; }

    public int? TestPort { get; init; }

    public string? Description { get; init; }

    public IReadOnlyCollection<ApiEndpoint> Endpoints => new ReadOnlyCollection<ApiEndpoint>(_endpoints);

    public IReadOnlyCollection<ApiTestPayload> TestPayloads => new ReadOnlyCollection<ApiTestPayload>(_testPayloads);

    public void AddEndpoint(ApiEndpoint endpoint)
    {
        _endpoints.Add(endpoint);
    }

    public void AddTestPayload(ApiTestPayload payload)
    {
        _testPayloads.Add(payload);
    }
}
