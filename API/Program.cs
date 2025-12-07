using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(o =>
    o.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    })
);

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors();

app.MapGet("/", () => "Hello World!");

app.MapPost(
    "/api/data/save",
    async (FormDataDto formData) =>
    {
        Console.WriteLine("Made it to POST");
        if (formData == null)
            return Results.BadRequest("Form data is missing");

        // Serialize the object to JSON
        var json = JsonSerializer.Serialize(
            formData,
            new JsonSerializerOptions { WriteIndented = true }
        );

        // Pick a save location
        var folderPath = Path.Combine("FormSaves");
        Directory.CreateDirectory(folderPath);

        // Create a unique file name
        var filePath = Path.Combine(folderPath, $"{formData.ProjectName}.json");

        await System.IO.File.WriteAllTextAsync(filePath, json);

        return Results.Ok(new {status = $"Saved to {filePath}"});
    }
);
app.MapGet(
    "/api/data/load",
    async ([FromQuery] string projectName) =>
    {
        if (string.IsNullOrWhiteSpace(projectName))
            return Results.BadRequest("projectName is required");

        var folderPath = Path.Combine("FormSaves");
        if (!Directory.Exists(folderPath))
            return Results.NotFound("No saved projects found");

        var files = Directory.GetFiles(folderPath, "*.json");

        var matches = new List<(string path, FormDataDto dto)>();

        foreach (var f in files)
        {
            try
            {
                var text = await System.IO.File.ReadAllTextAsync(f);
                var dto = JsonSerializer.Deserialize<FormDataDto>(text);
                if (dto != null && string.Equals(dto.ProjectName, projectName, StringComparison.OrdinalIgnoreCase))
                {
                    matches.Add((f, dto));
                }
            }
            catch
            {
                // ignore malformed files
            }
        }

        if (!matches.Any())
            return Results.NotFound(new { status = "No matching project found" });

        var latest = matches.OrderByDescending(m => new FileInfo(m.path).LastWriteTime).First();

        return Results.Ok(latest.dto);
    }
);
app.Run();
