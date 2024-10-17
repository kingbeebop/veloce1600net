using Microsoft.AspNetCore.Identity;

public class User : IdentityUser
{
    public string? Avatar { get; set; }
}
