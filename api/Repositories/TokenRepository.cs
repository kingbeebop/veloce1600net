using System.Collections.Concurrent;
using System.Threading.Tasks;

public class TokenRepository : ITokenRepository
{
    private readonly ConcurrentDictionary<string, string> _refreshTokens = new(); // Thread-safe in-memory storage

    public Task StoreRefreshTokenAsync(string userId, string refreshToken)
    {
        _refreshTokens[refreshToken] = userId; // Store the refresh token associated with the user ID
        Console.WriteLine($"Stored Refresh Token: {refreshToken} for User ID: {userId}");

        // Print all tokens for debugging
        PrintAllRefreshTokens();

        return Task.CompletedTask;
    }

    public Task<string> ValidateRefreshTokenAsync(string refreshToken)
    {
        PrintAllRefreshTokens();
        if (_refreshTokens.TryGetValue(refreshToken, out var userId))
        {
            Console.WriteLine($"Validated Refresh Token: {refreshToken} for User ID: {userId}");
            return Task.FromResult(userId); // Return the user ID
        }

        Console.WriteLine($"Invalid Refresh Token: {refreshToken}");
        return Task.FromResult<string>(null); // Return null if not found
    }

    public void PrintAllRefreshTokens()
    {
        Console.WriteLine("Current Refresh Tokens in Storage:");
        foreach (var kvp in _refreshTokens)
        {
            Console.WriteLine($"Refresh Token: {kvp.Key}, User ID: {kvp.Value}");
        }
    }
}
