using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;
    private readonly ITokenRepository _tokenRepository;

    public AuthController(UserManager<User> userManager, IConfiguration configuration, ITokenRepository tokenRepository)
    {
        _userManager = userManager;
        _configuration = configuration;
        _tokenRepository = tokenRepository;
    }

    [HttpPost("token")]
    public async Task<IActionResult> GenerateToken([FromBody] LoginModel model)
    {
        if (model == null || string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
        {
            return BadRequest(new { message = "Invalid login details." });
        }

        var user = await _userManager.FindByNameAsync(model.Username);
        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? string.Empty));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var accessToken = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds
        );

        var refreshToken = GenerateRefreshToken();
        await _tokenRepository.StoreRefreshTokenAsync(user.Id, refreshToken); // Store the refresh token

        return Ok(new
        {
            access = new JwtSecurityTokenHandler().WriteToken(accessToken),
            refresh = refreshToken
        });
    }

    [HttpPost("token/refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenModel model)
    {
        if (model == null || string.IsNullOrEmpty(model.RefreshToken))
        {
            return BadRequest(new { message = "Invalid refresh token." });
        }

        // Validate the refresh token
        var userId = await _tokenRepository.ValidateRefreshTokenAsync(model.RefreshToken);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "Invalid refresh token." });
        }

        // Retrieve the user based on the userId
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? string.Empty));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var newAccessToken = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds
        );

        return Ok(new
        {
            access = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
            refresh = model.RefreshToken // Return the same refresh token or generate a new one if needed
        });
    }

    private string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString(); // Simple refresh token generation
    }
}

// Models
public class LoginModel
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}

public class RefreshTokenModel
{
    public required string RefreshToken { get; set; }
}
