using System.Collections.Generic;
using System.Threading.Tasks;

public interface ICarRepository
{
    Task<IEnumerable<Car>> GetCarsAsync(string? search = null, string? sort = null, int page = 1, int pageSize = 10);
    Task<int> GetCarCountAsync(string? search); // New method for counting cars
    Task<Car> GetCarByIdAsync(int id);
    Task AddCarAsync(Car car);
    Task UpdateCarAsync(Car car);
    Task DeleteCarAsync(int id);
}
