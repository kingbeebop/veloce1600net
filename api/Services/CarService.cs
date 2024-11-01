using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

public class CarService
{
    private readonly ICarRepository _carRepository;
    private readonly IRedisService _redisService;

    public CarService(ICarRepository carRepository, IRedisService redisService)
    {
        _carRepository = carRepository;
        _redisService = redisService;
    }

    public async Task<IEnumerable<CarDto>> GetCarsAsync(string? search = null, string? sort = null, int page = 1, int pageSize = 10)
    {
        var cacheKey = GenerateCacheKey("cars", search ?? string.Empty, sort ?? string.Empty, page.ToString(), pageSize.ToString());
        var cachedCars = await GetFromCacheAsync<IEnumerable<CarDto>>(cacheKey);

        if (cachedCars != null)
        {
            return cachedCars;
        }

        var cars = await _carRepository.GetCarsAsync(search, sort, page, pageSize);
        var carDtos = MapToCarDtos(cars);

        await CacheResultAsync(cacheKey, carDtos);
        return carDtos;
    }

    public async Task<CarDto> GetCarByIdAsync(int id)
    {
        var cacheKey = GenerateCacheKey("car", id.ToString());
        var cachedCar = await GetFromCacheAsync<CarDto>(cacheKey);

        if (cachedCar != null)
        {
            return cachedCar;
        }

        var car = await _carRepository.GetCarByIdAsync(id);
        if (car == null)
        {
            return null; // Handle not found case in the controller
        }

        var carDto = MapToCarDto(car);
        await CacheResultAsync(cacheKey, carDto);
        return carDto;
    }

    public async Task AddCarAsync(CarDto carDto)
    {
        var car = MapToCar(carDto);
        await _carRepository.AddCarAsync(car);
        await InvalidateCacheAsync();
    }

    public async Task UpdateCarAsync(int id, CarDto carDto)
    {
        var existingCar = await _carRepository.GetCarByIdAsync(id);
        if (existingCar == null)
        {
            throw new KeyNotFoundException($"Car with ID {id} not found.");
        }

        UpdateCarFromDto(existingCar, carDto);
        await _carRepository.UpdateCarAsync(existingCar);
        await InvalidateCacheAsync(id);
    }

    public async Task DeleteCarAsync(int id)
    {
        await _carRepository.DeleteCarAsync(id);
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
            Console.WriteLine($"Redis error while fetching {cacheKey}: {ex.Message}");
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
            Console.WriteLine($"Redis error while caching {cacheKey}: {ex.Message}");
        }
    }

    private async Task InvalidateCacheAsync(int? id = null)
    {
        if (id.HasValue)
        {
            await _redisService.SetStringAsync(GenerateCacheKey("car", id.Value.ToString()), null);
        }
        // Optionally clear all car caches, if desired
        // await _redisService.KeyDeleteAsync("cars:*"); // Uncomment if needed
    }

    private string GenerateCacheKey(params string[] parts)
    {
        return string.Join(":", parts);
    }

    private IEnumerable<CarDto> MapToCarDtos(IEnumerable<Car> cars)
    {
        return cars.Select(MapToCarDto).ToList();
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
