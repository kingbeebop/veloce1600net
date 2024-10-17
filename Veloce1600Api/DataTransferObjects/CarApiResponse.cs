using System.Collections.Generic;

public class CarApiResponse
{
    public int Count { get; set; }
    public int? Next { get; set; }
    public int? Previous { get; set; }
    public int CurrentPage { get; set; } // Property for current page
    public List<Car> Results { get; set; } = new List<Car>(); // Default to an empty list
}
