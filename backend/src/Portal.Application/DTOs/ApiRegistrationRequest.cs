using System.ComponentModel.DataAnnotations;
using Portal.Domain.Entities;

namespace Portal.Application.DTOs;

/// <summary>
/// Request contract received from the API portal frontend when registering a new API.
/// </summary>
public sealed class ApiRegistrationRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Owner { get; set; } = string.Empty;

    [Required]
    [Url]
    public string BaseUrl { get; set; } = string.Empty;

    public string? ProductionUrl { get; set; }

    public int? TestPort { get; set; }

    public string? Description { get; set; }

    public ICollection<ApiEndpoint> Endpoints { get; set; } = new List<ApiEndpoint>();
}
