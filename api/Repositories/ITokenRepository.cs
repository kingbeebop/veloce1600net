// ITokenRepository.cs
public interface ITokenRepository
{
    Task StoreRefreshTokenAsync(string userId, string refreshToken);
    Task<string> ValidateRefreshTokenAsync(string refreshToken);
}
