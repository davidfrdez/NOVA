namespace Portal.Domain.Entities;

/// <summary>
/// Represents a single endpoint exposed by an API definition.
/// </summary>
public sealed class ApiEndpoint
{
    public required string Name { get; init; }

    public required string Path { get; init; }

    public required string HttpMethod { get; init; }

    public string? Description { get; init; }
}
