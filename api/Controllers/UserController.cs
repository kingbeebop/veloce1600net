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
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        var userId = userIdClaim.Value; // Extract the user ID
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

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
