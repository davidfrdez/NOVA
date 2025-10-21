using System.ComponentModel.DataAnnotations;

namespace Portal.Application.DTOs;

/// <summary>
/// Represents the payload sent when saving or executing an endpoint test.
/// </summary>
public sealed class ApiTestRequest
{
    [Required]
    public string EndpointName { get; set; } = string.Empty;

    [Required]
    public string HttpMethod { get; set; } = "GET";

    public string? RelativePathOverride { get; set; }

    [Required]
    public string JsonBody { get; set; } = string.Empty;
}
