using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Car> Cars { get; set; }
    public DbSet<Owner> Owners { get; set; }
    public DbSet<Sale> Sales { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure the Car-Owner relationship
        modelBuilder.Entity<Car>()
            .HasOne(c => c.Owner)
            .WithMany()
            .HasForeignKey(c => c.OwnerId)
            .OnDelete(DeleteBehavior.SetNull); // Adjust delete behavior as needed

        // Additional model configurations if needed
    }

    private static string GetConnectionString()
    {
        // Load environment variables
        var host = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
        var port = Environment.GetEnvironmentVariable("DB_PORT") ?? "5432";
        var dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "velocenetdb";
        var user = Environment.GetEnvironmentVariable("DB_USER") ?? "velocenetuser";
        var password = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "negator77";

        // Create connection string
        return $"Host={host};Port={port};Database={dbName};Username={user};Password={password};";
    }
}