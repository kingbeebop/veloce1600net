public class FileUploadService
{
    private readonly IWebHostEnvironment _environment;
    private const long MaxFileSize = 1132761; // Maximum file size in bytes (1 MB)

    public FileUploadService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<(string filePath, string message)> UploadFileAsync(IFormFile file)
    {
        // Check if the file is null or has zero length
        if (file == null || file.Length == 0)
            return (null, "No file uploaded.");

        // Check if the file size exceeds the maximum allowed size
        if (file.Length > MaxFileSize)
        {
            // File is too large, return a message but proceed with no image
            return (null, "File exceeds maximum size of 1 MB. Car created without an image.");
        }

        var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
        Directory.CreateDirectory(uploadsFolder); // Ensure the directory exists

        var uniqueFileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var uniqueFilePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(uniqueFilePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return ($"/uploads/{uniqueFileName}", "File uploaded successfully.");
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
