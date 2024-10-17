public class FileUploadService
{
    private readonly IWebHostEnvironment _environment;

    public FileUploadService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return null;

        var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
        Directory.CreateDirectory(uploadsFolder); // Ensure the directory exists

        var uniqueFileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var uniqueFilePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(uniqueFilePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"/uploads/{uniqueFileName}"; // Return the relative URL to access the file
    }

    public void DeleteFile(string filePath)
    {
        if (string.IsNullOrEmpty(filePath))
            return;

        var fullPath = Path.Combine(_environment.WebRootPath, filePath.TrimStart('/'));
        if (System.IO.File.Exists(fullPath))
        {
            System.IO.File.Delete(fullPath);
        }
    }
}
