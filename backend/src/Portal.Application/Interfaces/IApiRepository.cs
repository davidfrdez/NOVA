using Portal.Domain.Entities;

namespace Portal.Application.Interfaces;

/// <summary>
/// Abstraction for persisting <see cref="ApiDefinition"/> aggregates.
/// </summary>
public interface IApiRepository
{
    Task<ApiDefinition> AddAsync(ApiDefinition apiDefinition, CancellationToken cancellationToken = default);

    Task<ApiDefinition?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<ApiDefinition>> ListAsync(CancellationToken cancellationToken = default);

    Task<ApiTestPayload> AddTestPayloadAsync(Guid apiId, ApiTestPayload payload, CancellationToken cancellationToken = default);
}
