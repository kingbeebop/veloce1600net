using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.IO;
using System.Threading.Tasks;

public class DatabaseInitializer
{
    private readonly ApplicationDbContext _context;

    public DatabaseInitializer(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SeedDataAsync()
    {
        // Check if the database is empty
        if (!await _context.Users.AnyAsync()) // Change this to a table that will always have data
        {
            var sql = await File.ReadAllTextAsync("velocenetdb.sql");
            await _context.Database.ExecuteSqlRawAsync(sql);
        }
    }
}
