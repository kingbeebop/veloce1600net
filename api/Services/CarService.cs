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
        var carDtos = MapToCarDtos(cars);

        var response = new CarApiResponse
        {
            Count = totalCars,
            CurrentPage = page,
            Results = carDtos.ToList(),
            Next = (page * pageSize < totalCars) ? page + 1 : (int?)null,
            Previous = (page > 1) ? page - 1 : (int?)null
        };

        await CacheResultAsync(cacheKey, response);
        return response;
    }

    public async Task<CarDto?> GetCarByIdAsync(int id)
    {
        var cacheKey = GenerateCacheKey("car", id.ToString());
        var cachedCar = await GetFromCacheAsync<CarDto>(cacheKey);

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
            return null;
        }

        var carDto = MapToCarDto(car);
        await CacheResultAsync(cacheKey, carDto);
        return carDto;
    }

    public async Task AddCarAsync(CarDto carDto)
    {
        var car = MapToCar(carDto);
        await _carRepository.AddCarAsync(car);
        _logger.LogInformation($"Car with ID {car.Id} added. Invalidating cache...");
        await InvalidateCacheAsync();
    }

    public async Task UpdateCarAsync(int id, CarDto carDto)
    {
        var existingCar = await _carRepository.GetCarByIdAsync(id);
        if (existingCar == null)
        {
            _logger.LogError($"Car with ID {id} not found for update.");
            throw new KeyNotFoundException($"Car with ID {id} not found.");
        }

        UpdateCarFromDto(existingCar, carDto);
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
            var carCacheKey = GenerateCacheKey("car", id.Value.ToString());
            await _redisService.SetStringAsync(carCacheKey, null);
            _logger.LogInformation($"Cache invalidated for key: {carCacheKey}");
        }
        // Optionally clear all car caches if desired
        // await _redisService.KeyDeleteAsync("cars:*"); // Uncomment if needed
    }

    private string GenerateCacheKey(params string[] parts)
    {
        return string.Join(":", parts);
    }

    private IEnumerable<CarDto> MapToCarDtos(IEnumerable<Car> cars)
    {
        return cars.Select(MapToCarDto);
    }

    private CarDto MapToCarDto(Car car)
    {
        return new CarDto
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
    }

    private Car MapToCar(CarDto carDto)
    {
        return new Car
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
    }

    private void UpdateCarFromDto(Car car, CarDto carDto)
    {
        car.Make = carDto.Make;
        car.Model = carDto.Model;
        car.Year = carDto.Year;
        car.Vin = carDto.Vin;
        car.Mileage = carDto.Mileage;
        car.Price = carDto.Price;
        car.Features = carDto.Features;
        car.Condition = carDto.Condition;
        car.ImagePath = carDto.ImagePath;
        car.UpdatedAt = DateTime.UtcNow;
    }
}