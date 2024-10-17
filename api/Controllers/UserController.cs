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
}

public class UserResponse
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Avatar { get; set; } // Optional image path for avatar
}
