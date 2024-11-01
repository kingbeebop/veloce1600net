using StackExchange.Redis;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

public class CarService
{
    private readonly ICarRepository _carRepository;
    private readonly IConnectionMultiplexer _redis;

    public CarService(ICarRepository carRepository, IConnectionMultiplexer redis)
    {
        _carRepository = carRepository;
        _redis = redis;
    }

    public async Task<IEnumerable<CarDto>> GetCarsAsync(string? search = null, string? sort = null, int page = 1, int pageSize = 10)
    {
        var db = _redis.GetDatabase();
        var cacheKey = $"cars:{search}:{sort}:{page}:{pageSize}";

        // Check Redis cache first
        var cachedCars = await db.StringGetAsync(cacheKey);
        if (cachedCars.HasValue)
        {
            return JsonSerializer.Deserialize<IEnumerable<CarDto>>(cachedCars);
        }

        // Retrieve cars from the database
        var cars = await _carRepository.GetCarsAsync(search, sort, page, pageSize);

        // Convert Car entities to CarDto
        var carDtos = cars.Select(car => new CarDto
        {
            Id = car.Id,
            Make = car.Make,
            Model = car.Model,
            Year = car.Year,
            Vin = car.Vin,
            Mileage = car.Mileage,
            Price = car.Price,
            Features = car.Features,
            Condition = car.Condition,
            ImagePath = car.ImagePath
        });

        // Cache the result in Redis
        await db.StringSetAsync(cacheKey, JsonSerializer.Serialize(carDtos), TimeSpan.FromMinutes(5));

        return carDtos;
    }

    public async Task<CarDto> GetCarByIdAsync(int id)
    {
        var db = _redis.GetDatabase();
        var cacheKey = $"car:{id}";

        // Check Redis cache first
        var cachedCar = await db.StringGetAsync(cacheKey);
        if (cachedCar.HasValue)
        {
            return JsonSerializer.Deserialize<CarDto>(cachedCar);
        }

        // Retrieve car from the database
        var car = await _carRepository.GetCarByIdAsync(id);
        if (car == null)
        {
            return null; // Handle not found case in controller
        }

        // Convert to CarDto
        var carDto = new CarDto
        {
            Id = car.Id,
            Make = car.Make,
            Model = car.Model,
            Year = car.Year,
            Vin = car.Vin,
            Mileage = car.Mileage,
            Price = car.Price,
            Features = car.Features,
            Condition = car.Condition,
            ImagePath = car.ImagePath
        };

        // Cache the result in Redis
        await db.StringSetAsync(cacheKey, JsonSerializer.Serialize(carDto), TimeSpan.FromMinutes(5));

        return carDto;
    }

    public async Task AddCarAsync(CarDto carDto)
    {
        // Map DTO to entity
        var car = new Car
        {
            Make = carDto.Make,
            Model = carDto.Model,
            Year = carDto.Year,
            Vin = carDto.Vin,
            Mileage = carDto.Mileage,
            Price = carDto.Price,
            Features = carDto.Features,
            Condition = carDto.Condition,
            ImagePath = carDto.ImagePath,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Add to the repository
        await _carRepository.AddCarAsync(car);

        // Optionally invalidate the cache (or leave it to expire naturally)
        await InvalidateCacheAsync();
    }

    public async Task UpdateCarAsync(int id, CarDto carDto)
    {
        // Retrieve the existing car
        var existingCar = await _carRepository.GetCarByIdAsync(id);
        if (existingCar == null)
        {
            throw new KeyNotFoundException($"Car with ID {id} not found.");
        }

        // Update properties
        existingCar.Make = carDto.Make;
        existingCar.Model = carDto.Model;
        existingCar.Year = carDto.Year;
        existingCar.Vin = carDto.Vin;
        existingCar.Mileage = carDto.Mileage;
        existingCar.Price = carDto.Price;
        existingCar.Features = carDto.Features;
        existingCar.Condition = carDto.Condition;
        existingCar.ImagePath = carDto.ImagePath;
        existingCar.UpdatedAt = DateTime.UtcNow;

        // Save changes to the repository
        await _carRepository.UpdateCarAsync(existingCar);

        // Invalidate the cache for the specific car
        var db = _redis.GetDatabase();
        await db.KeyDeleteAsync($"car:{id}");
        await InvalidateCacheAsync();
    }

    public async Task DeleteCarAsync(int id)
    {
        // Delete the car from the repository
        await _carRepository.DeleteCarAsync(id);

        // Invalidate the cache for the specific car
        var db = _redis.GetDatabase();
        await db.KeyDeleteAsync($"car:{id}");
        await InvalidateCacheAsync();
    }

    private async Task InvalidateCacheAsync()
    {
        // Optionally delete all cached car data
        var db = _redis.GetDatabase();
        // You can implement a key pattern matching or a better cache strategy if needed.
        // This is a basic way to remove all car-related cached items.
        // E.g., await db.KeyDeleteAsync("cars:*"); // Be careful with this!
    }
}