using Portal.Domain.Entities;

namespace Portal.Application.Interfaces;

/// <summary>
/// Executes stored payloads against live endpoints.
/// </summary>
public interface IEndpointTester
{
    Task<ApiTestExecutionResult> ExecuteAsync(ApiDefinition api, ApiTestPayload payload, CancellationToken cancellationToken = default);
}

/// <summary>
/// Result returned by <see cref="IEndpointTester"/> when invoking an endpoint.
/// </summary>
public sealed record ApiTestExecutionResult(int StatusCode, string ResponseBody, IDictionary<string, IEnumerable<string>> ResponseHeaders);
