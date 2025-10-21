using Portal.Application.Interfaces;
using Portal.Domain.Entities;

namespace Portal.Infrastructure.Persistence;

/// <summary>
/// In-memory implementation suited for demos and early development stages.
/// </summary>
public sealed class InMemoryApiRepository : IApiRepository
{
    private readonly Dictionary<Guid, ApiDefinition> _store = new();
    private readonly object _lock = new();

    public Task<ApiDefinition> AddAsync(ApiDefinition apiDefinition, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            _store[apiDefinition.Id] = apiDefinition;
        }

        return Task.FromResult(apiDefinition);
    }

    public Task<ApiDefinition?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            _store.TryGetValue(id, out var api);
            return Task.FromResult(api);
        }
    }

    public Task<IReadOnlyCollection<ApiDefinition>> ListAsync(CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            IReadOnlyCollection<ApiDefinition> result = _store.Values.ToList();
            return Task.FromResult(result);
        }
    }

    public Task<ApiTestPayload> AddTestPayloadAsync(Guid apiId, ApiTestPayload payload, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            if (!_store.TryGetValue(apiId, out var api))
            {
                throw new KeyNotFoundException($"API with id '{apiId}' was not found.");
            }

            api.AddTestPayload(payload);
            return Task.FromResult(payload);
        }
    }
}
