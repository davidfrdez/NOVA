using System.Linq;
using Portal.Application.Interfaces;
using Portal.Domain.Entities;

namespace Portal.Infrastructure.Services;

/// <summary>
/// Executes HTTP requests using <see cref="HttpClient"/>.
/// </summary>
public sealed class HttpEndpointTester : IEndpointTester
{
    private readonly IHttpClientFactory _httpClientFactory;

    public HttpEndpointTester(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<ApiTestExecutionResult> ExecuteAsync(ApiDefinition api, ApiTestPayload payload, CancellationToken cancellationToken = default)
    {
        var client = _httpClientFactory.CreateClient("api-test");
        client.BaseAddress = api.BaseUrl;

        using var request = new HttpRequestMessage(new HttpMethod(payload.HttpMethod), payload.RelativePathOverride ?? payload.EndpointName);

        if (!string.IsNullOrWhiteSpace(payload.JsonBody) && payload.HttpMethod is not "GET")
        {
            request.Content = new StringContent(payload.JsonBody, System.Text.Encoding.UTF8, "application/json");
        }

        using var response = await client.SendAsync(request, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);

        var headers = response.Headers.Concat(response.Content.Headers)
            .GroupBy(h => h.Key, h => h.Value)
            .ToDictionary(g => g.Key, g => (IEnumerable<string>)g.SelectMany(v => v));

        return new ApiTestExecutionResult((int)response.StatusCode, body, headers);
    }
}
