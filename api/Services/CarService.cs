using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public class CarService
{
    private readonly ICarRepository _carRepository;
    private readonly IRedisService _redisService;
    private readonly ILogger<CarService> _logger;

    public CarService(ICarRepository carRepository, IRedisService redisService, ILogger<CarService> logger)
    {
        _carRepository = carRepository;
        _redisService = redisService;
        _logger = logger;
    }

    public async Task<CarApiResponse> GetCarsAsync(string? search = null, string? sort = null, int page = 1, int pageSize = 10)
    {
        var cacheKey = GenerateCacheKey("cars", search ?? string.Empty, sort ?? string.Empty, page.ToString(), pageSize.ToString());
        var cachedResponse = await GetFromCacheAsync<CarApiResponse>(cacheKey);

        if (cachedResponse != null)
        {
            _logger.LogInformation($"Cache hit for key: {cacheKey}");
            return cachedResponse;
        }

        _logger.LogInformation($"Cache miss for key: {cacheKey}. Fetching from database...");
        var totalCars = await _carRepository.GetCarCountAsync(search);
        var cars = await _carRepository.GetCarsAsync(search, sort, page, pageSize);

        var response = new CarApiResponse
        {
            Count = totalCars,
            CurrentPage = page,
            Results = cars.ToList(), // Directly using the Car list
            Next = (page * pageSize < totalCars) ? page + 1 : (int?)null,
            Previous = (page > 1) ? page - 1 : (int?)null
        };

        // Cache the result
        await CacheResultAsync(cacheKey, response);
        return response;
    }

    public async Task<Car?> GetCarByIdAsync(int id)
    {
        var cacheKey = GenerateCacheKey("car", id.ToString());
        var cachedCar = await GetFromCacheAsync<Car>(cacheKey);

        if (cachedCar != null)
        {
            _logger.LogInformation($"Cache hit for key: {cacheKey}");
            return cachedCar;
        }

        _logger.LogInformation($"Cache miss for key: {cacheKey}. Fetching from database...");
        var car = await _carRepository.GetCarByIdAsync(id);
        if (car == null)
        {
            _logger.LogWarning($"Car with ID {id} not found in database.");
            return null; // Handle not found case in the controller
        }

        await CacheResultAsync(cacheKey, car);
        return car;
    }

    public async Task AddCarAsync(Car car)
    {
        await _carRepository.AddCarAsync(car);
        _logger.LogInformation($"Car with ID {car.Id} added. Invalidating cache...");
        await InvalidateCacheAsync();
    }

    public async Task UpdateCarAsync(int id, Car car)
    {
        var existingCar = await _carRepository.GetCarByIdAsync(id);
        if (existingCar == null)
        {
            _logger.LogError($"Car with ID {id} not found for update.");
            throw new KeyNotFoundException($"Car with ID {id} not found.");
        }

        UpdateCarFromDto(existingCar, car);
        await _carRepository.UpdateCarAsync(existingCar);
        _logger.LogInformation($"Car with ID {id} updated. Invalidating cache...");
        await InvalidateCacheAsync(id);
    }

    public async Task DeleteCarAsync(int id)
    {
        await _carRepository.DeleteCarAsync(id);
        _logger.LogInformation($"Car with ID {id} deleted. Invalidating cache...");
        await InvalidateCacheAsync(id);
    }

    private async Task<T?> GetFromCacheAsync<T>(string cacheKey)
    {
        try
        {
            var cachedValue = await _redisService.GetStringAsync(cacheKey);
            return cachedValue != null ? JsonSerializer.Deserialize<T>(cachedValue) : default;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Redis error while fetching {cacheKey}: {ex.Message}");
            return default;
        }
    }

    private async Task CacheResultAsync<T>(string cacheKey, T value, TimeSpan? expiration = null)
    {
        try
        {
            await _redisService.SetStringAsync(cacheKey, JsonSerializer.Serialize(value), expiration ?? TimeSpan.FromMinutes(5));
        }
        catch (Exception ex)
        {
            _logger.LogError($"Redis error while caching {cacheKey}: {ex.Message}");
        }
    }

    private async Task InvalidateCacheAsync(int? id = null)
    {
        if (id.HasValue)
        {
            await _redisService.SetStringAsync(GenerateCacheKey("car", id.Value.ToString()), null);
            _logger.LogInformation($"Cache invalidated for key: {GenerateCacheKey("car", id.Value.ToString())}");
        }
        // Optionally clear all car caches if desired
        // await _redisService.KeyDeleteAsync("cars:*"); // Uncomment if needed
    }

    private string GenerateCacheKey(params string[] parts)
    {
        return string.Join(":", parts);
    }

    private void UpdateCarFromDto(Car car, Car updatedCar)
    {
        car.Make = updatedCar.Make ?? car.Make; // Only update if provided
        car.Model = updatedCar.Model ?? car.Model;
        car.Year = updatedCar.Year ?? car.Year;
        car.Vin = updatedCar.Vin ?? car.Vin;
        car.Mileage = updatedCar.Mileage ?? car.Mileage;
        car.Price = updatedCar.Price ?? car.Price;
        car.Features = updatedCar.Features ?? car.Features;
        car.Condition = updatedCar.Condition ?? car.Condition;
        car.ImagePath = updatedCar.ImagePath ?? car.ImagePath;
        car.UpdatedAt = DateTime.UtcNow;
    }
}