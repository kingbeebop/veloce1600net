using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

public class CarService
{
    private readonly ICarRepository _carRepository;
    private readonly IRedisService _redisService; // Inject the Redis service

    public CarService(ICarRepository carRepository, IRedisService redisService)
    {
        _carRepository = carRepository;
        _redisService = redisService;
    }

    public async Task<IEnumerable<CarDto>> GetCarsAsync(string? search = null, string? sort = null, int page = 1, int pageSize = 10)
    {
        var cacheKey = $"cars:{search}:{sort}:{page}:{pageSize}";

        // Check Redis cache first
        var cachedCars = await _redisService.GetStringAsync(cacheKey);
        if (cachedCars != null)
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
        }).ToList();

        // Cache the result in Redis
        await _redisService.SetStringAsync(cacheKey, JsonSerializer.Serialize(carDtos), TimeSpan.FromMinutes(5));

        return carDtos;
    }

    public async Task<CarDto> GetCarByIdAsync(int id)
    {
        var cacheKey = $"car:{id}";

        // Check Redis cache first
        var cachedCar = await _redisService.GetStringAsync(cacheKey);
        if (cachedCar != null)
        {
            return JsonSerializer.Deserialize<CarDto>(cachedCar);
        }

        // Retrieve car from the database
        var car = await _carRepository.GetCarByIdAsync(id);
        if (car == null)
        {
            return null; // Handle not found case in the controller
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
        await _redisService.SetStringAsync(cacheKey, JsonSerializer.Serialize(carDto), TimeSpan.FromMinutes(5));

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

        // Invalidate the cache
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
        await _redisService.SetStringAsync($"car:{id}", null); // Remove from cache
        await InvalidateCacheAsync();
    }

    public async Task DeleteCarAsync(int id)
    {
        // Delete the car from the repository
        await _carRepository.DeleteCarAsync(id);

        // Invalidate the cache for the specific car
        await _redisService.SetStringAsync($"car:{id}", null); // Remove from cache
        await InvalidateCacheAsync();
    }

    private async Task InvalidateCacheAsync()
    {
        // Optionally delete all cached car data
        // This is a basic way to remove all car-related cached items.
        // Be cautious with this approach; it can impact performance.
        // await _redisService.KeyDeleteAsync("cars:*"); // Uncomment if you implement a better cache strategy
    }
}
