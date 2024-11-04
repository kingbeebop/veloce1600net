using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class CarsController : ControllerBase
{
    private readonly CarService _carService;
    private readonly ILogger<CarsController> _logger;

    public CarsController(CarService carService, ILogger<CarsController> logger)
    {
        _carService = carService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<CarApiResponse>> GetCars(string? search = null, string? sort = null, int page = 1, int pageSize = 10)
    {
        try
        {
            var cars = await _carService.GetCarsAsync(search, sort, page, pageSize);
            return Ok(cars);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving cars.");
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Car>> GetCar(int id)
    {
        try
        {
            var car = await _carService.GetCarByIdAsync(id);
            if (car == null) return NotFound($"Car with ID {id} not found.");
            return Ok(car);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred while retrieving the car with ID {id}.");
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    [HttpPost]
    public async Task<ActionResult<Car>> PostCar([FromBody] Car car)
    {
        if (car == null) return BadRequest("Car object is null.");

        try
        {
            await _carService.AddCarAsync(car);
            return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding a new car.");
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Car>> PutCar(int id, [FromBody] Car car)
    {
        if (car == null) return BadRequest("Car object is null.");

        try
        {
            await _carService.UpdateCarAsync(id, car);
            return Ok(car);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating the car.");
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCar(int id)
    {
        try
        {
            await _carService.DeleteCarAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting the car.");
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }
}