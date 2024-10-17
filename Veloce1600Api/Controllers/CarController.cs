using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace Veloce1600Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<CarsController> _logger;

        public CarsController(ApplicationDbContext context, IWebHostEnvironment environment, ILogger<CarsController> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
        }

        // GET: api/cars
        [HttpGet]
        public async Task<ActionResult<CarApiResponse>> GetCars(int page = 1, int pageSize = 10, string search = null, string sort = null, string condition = null)
        {
            try
            {
                IQueryable<Car> query = _context.Cars.AsQueryable();

                // Apply search filtering
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(car => (car.Make + " " + car.Model).Contains(search));
                }

                // Apply condition filtering
                if (!string.IsNullOrEmpty(condition))
                {
                    query = query.Where(car => car.Condition.Equals(condition, StringComparison.OrdinalIgnoreCase));
                }

                // Apply sorting based on the provided sort parameter
                query = sort switch
                {
                    "price" => query.OrderBy(car => car.Price),
                    "condition" => query.OrderBy(car => car.Condition),
                    _ => query.OrderBy(car => car.Make).ThenBy(car => car.Model),
                };

                // Pagination
                var totalCars = await query.CountAsync();
                var cars = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

                // Prepare the response object
                var response = new CarApiResponse
                {
                    Count = totalCars,
                    Results = cars,
                    CurrentPage = page,
                    Next = page * pageSize < totalCars ? page + 1 : (int?)null,
                    Previous = page > 1 ? page - 1 : (int?)null
                };

                return Ok(response); // Return the response
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting cars.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        // GET: api/cars/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> GetCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            return car == null ? NotFound() : Ok(car); // Return 404 if not found
        }

        // POST: api/cars
        [HttpPost]
        public async Task<ActionResult<Car>> PostCar([FromForm] Car car, [FromForm] IFormFile? imageFile, [FromServices] FileUploadService fileUploadService)
        {
            // Handle image upload if provided
            if (imageFile != null && imageFile.Length > 0)
            {
                var imageUrl = await fileUploadService.UploadFileAsync(imageFile);
                if (!string.IsNullOrEmpty(imageUrl))
                {
                    car.ImagePath = imageUrl; // Set the ImagePath property on the Car model
                }
            }

            // Set CreatedAt and UpdatedAt properties
            car.CreatedAt = DateTime.UtcNow;
            car.UpdatedAt = DateTime.UtcNow;

            // Add the new car to the context
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car); // Return 201 Created
        }

        // PUT: api/cars/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Car>> PutCar(int id, [FromForm] Car car, [FromForm] IFormFile? imageFile, [FromServices] FileUploadService fileUploadService)
        {
            var existingCar = await _context.Cars.FindAsync(id);
            if (existingCar == null) return NotFound(); // Return 404 if not found

            // Handle image upload if a new file is provided
            if (imageFile != null && imageFile.Length > 0)
            {
                // Delete the old image if it exists
                if (!string.IsNullOrEmpty(existingCar.ImagePath))
                {
                    var oldImagePath = Path.Combine(_environment.WebRootPath, existingCar.ImagePath.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                // Upload the new image
                var imageUrl = await fileUploadService.UploadFileAsync(imageFile);
                if (!string.IsNullOrEmpty(imageUrl))
                {
                    existingCar.ImagePath = imageUrl; // Update the ImagePath
                }
            }

            // Update the car properties from the provided car data
            existingCar.Make = car.Make;
            existingCar.Model = car.Model;
            existingCar.Year = car.Year;
            existingCar.Vin = car.Vin;
            existingCar.Mileage = car.Mileage;
            existingCar.Price = car.Price;
            existingCar.Features = car.Features;
            existingCar.Condition = car.Condition;
            existingCar.UpdatedAt = DateTime.UtcNow;

            // Save changes to the context
            _context.Entry(existingCar).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(existingCar); // Return the updated car object
        }

        // DELETE: api/cars/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null) return NotFound(); // Return 404 if not found

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent(); // Return 204 No Content on success
        }
    }
}
