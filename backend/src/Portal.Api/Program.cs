using Microsoft.AspNetCore.Mvc;
using Portal.Application.DTOs;
using Portal.Application.Services;
using Portal.Infrastructure.Extensions;
using Portal.Api.Extensions;
using Portal.Api.Features;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCustomSwagger();
builder.Services.AddPortalServices();
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
    });
});

var app = builder.Build();

app.UseCors("frontend");
app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTimeOffset.UtcNow }))
   .WithName("HealthCheck")
   .WithTags("Health");

app.MapApiCatalogEndpoints();

app.Run();
