using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public UserController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserResponse>> GetUser()
    {
        // Retrieve the user's ID from the token claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        var userId = userIdClaim.Value; // Extract the user ID
        var user = await _userManager.FindByIdAsync(userId);

        // If user is not found, return a detailed error message
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        // Construct and return the user response
        var userResponse = new UserResponse
        {
            Username = user.UserName,
            Email = user.Email,
            Avatar = user.Avatar // Ensure your User model has an Avatar property
        };

        return Ok(userResponse);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserResponse>> Register([FromBody] RegisterRequest request)
    {
        // Validate the request
        if (request == null || string.IsNullOrEmpty(request.Username) || 
            string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.Email))
        {
            return BadRequest(new { message = "Invalid registration details." });
        }

        var user = new User
        {
            UserName = request.Username,
            Email = request.Email,
            Avatar = null // Default avatar to null
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest(new { message = "User registration failed.", errors = result.Errors });
        }

        // Construct and return the user response
        var userResponse = new UserResponse
        {
            Username = user.UserName,
            Email = user.Email,
            Avatar = null // Default avatar to null
        };

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userResponse);
    }
}

public class RegisterRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
}

public class UserResponse
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Avatar { get; set; } // Optional image path for avatar
}
