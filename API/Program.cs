using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
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
        var filePath = Path.Combine(folderPath, $"form_{DateTime.Now:yyyyMMdd_HHmmss}.json");

        await System.IO.File.WriteAllTextAsync(filePath, json);

        return Results.Ok(new {status = $"Saved to {filePath}"});
    }
);
app.Run();
