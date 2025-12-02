var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(o => o.AddDefaultPolicy(policy =>
{
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader();
}));

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors();

app.MapGet("/", () => "Hello World!");
app.MapControllers();

app.Run();

using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
var app = builder.Build();
app.MapControllers();
app.Run();

// ...existing code...
[ApiController]
[Route("api/[controller]")]
public class DataController : ControllerBase
{
    [HttpPost("save")]
    public async Task<IActionResult> Save([FromBody] FormDataDto formData)
    {
        Console.WriteLine("Made it");
        if (formData == null)
            return BadRequest("Form data is missing");

        // Serialize the object to JSON
        var json = JsonSerializer.Serialize(formData, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        // Pick a save location
        var folderPath = Path.Combine("FormSaves");
        Directory.CreateDirectory(folderPath);

        // Create a unique file name
        var filePath = Path.Combine(folderPath, $"form_{DateTime.Now:yyyyMMdd_HHmmss}.json");

        await System.IO.File.WriteAllTextAsync(filePath, json);

        return Ok($"Saved to {filePath}");
    }
}

// Simple DTO fallback — remove or replace if FormDataDto exists elsewhere in the project
public class FormDataDto
{
    // Add properties that match your form. This is a flexible placeholder.
    public Dictionary<string, object> Fields { get; set; } = new();
}
```// filepath: c:\Users\ethan.hintze\IntroToWeb\final\WebDevFinalProject\API\Program.cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
var app = builder.Build();
app.MapControllers();
app.Run();

// ...existing code...
[ApiController]
[Route("api/[controller]")]
public class DataController : ControllerBase
{
    [HttpPost("save")]
    public async Task<IActionResult> Save([FromBody] FormDataDto formData)
    {
        Console.WriteLine("Made it");
        if (formData == null)
            return BadRequest("Form data is missing");

        // Serialize the object to JSON
        var json = JsonSerializer.Serialize(formData, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        // Pick a save location
        var folderPath = Path.Combine("FormSaves");
        Directory.CreateDirectory(folderPath);

        // Create a unique file name
        var filePath = Path.Combine(folderPath, $"form_{DateTime.Now:yyyyMMdd_HHmmss}.json");

        await System.IO.File.WriteAllTextAsync(filePath, json);

        return Ok($"Saved to {filePath}");
    }
}

// Simple DTO fallback — remove or replace if FormDataDto exists elsewhere in the project
public class FormDataDto
{
    // Add properties that match your form. This is a flexible placeholder.
    public Dictionary<string, object> Fields { get; set;