public class Sale
{
    public int Id { get; set; }
    public int CarId { get; set; }
    public int OwnerId { get; set; }
    public decimal SalePrice { get; set; }
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
    public required Car Car { get; set; }
    public Owner? Owner { get; set; }
}