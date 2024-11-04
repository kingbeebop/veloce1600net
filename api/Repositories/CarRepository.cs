using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class CarRepository : ICarRepository
{
    private readonly ApplicationDbContext _context;

    public CarRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Car>> GetCarsAsync(string? search = null, string? sort = null, int page = 1, int pageSize = 10)
    {
        IQueryable<Car> query = _context.Cars.AsQueryable();

        // Search filtering
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(car => 
                (car.Make + " " + car.Model).Contains(search));
        }

        // Sorting logic
        if (sort == "price")
        {
            query = query.OrderBy(car => car.Price);
        }
        else if (sort == "year")
        {
            query = query.OrderBy(car => car.Year);
        }

        // Pagination
        return await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetCarCountAsync(string? search = null)
    {
        IQueryable<Car> query = _context.Cars.AsQueryable();

        // Search filtering for count
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(car => 
                (car.Make + " " + car.Model).Contains(search));
        }

        return await query.CountAsync();
    }

    public async Task<Car> GetCarByIdAsync(int id)
    {
        return await _context.Cars.FindAsync(id);
    }

    public async Task AddCarAsync(Car car)
    {
        await _context.Cars.AddAsync(car);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateCarAsync(Car car)
    {
        _context.Entry(car).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCarAsync(int id)
    {
        var car = await GetCarByIdAsync(id);
        if (car != null)
        {
            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();
        }
    }
}