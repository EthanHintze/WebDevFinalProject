using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[ApiController]
[Route("api/[controller]")]
public class DataController : ControllerBase
{
    [HttpPost("save")]
    public async Task<IActionResult> Save([FromBody] FormDataDto formData)
    {
        if (formData == null)
            return BadRequest("Form data is missing");

        // Serialize the object to JSON
        var json = JsonSerializer.Serialize(formData, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        // Pick a save location
        var folderPath = Path.Combine("C:\\Temp\\FormSaves");
        Directory.CreateDirectory(folderPath);

        // Create a unique file name
        var filePath = Path.Combine(folderPath, $"form_{DateTime.Now:yyyyMMdd_HHmmss}.json");

        await System.IO.File.WriteAllTextAsync(filePath, json);

        return Ok($"Saved to {filePath}");
    }
}
