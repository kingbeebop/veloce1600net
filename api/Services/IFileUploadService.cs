public interface IFileUploadService
{
    Task<(string filePath, string message)> UploadFileAsync(IFormFile file);
    void DeleteFile(string filePath);
}
