namespace Portal.Domain.Entities;

/// <summary>
/// Represents a stored JSON payload that can be executed against a specific endpoint.
/// </summary>
public sealed class ApiTestPayload
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public required string EndpointName { get; init; }

    public required string HttpMethod { get; init; }

    public string? RelativePathOverride { get; init; }

    public required string JsonBody { get; init; }

    public DateTimeOffset CreatedOn { get; init; } = DateTimeOffset.UtcNow;
}
