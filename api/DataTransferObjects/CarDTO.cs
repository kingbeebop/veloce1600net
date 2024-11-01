public class CarDto
{
    public int Id { get; set; }
    public string? Make { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public string? Vin { get; set; }
    public int? Mileage { get; set; }
    public decimal? Price { get; set; }
    public string? Features { get; set; }
    public string? Condition { get; set; }
    public string? ImagePath { get; set; }
    public int? OwnerId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
