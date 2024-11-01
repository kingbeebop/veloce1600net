using StackExchange.Redis;
using System;
using System.Threading.Tasks;

public interface IRedisConnectionFactory
{
    Task<IConnectionMultiplexer> GetConnectionAsync();
}

public class RedisConnectionFactory : IRedisConnectionFactory
{
    private readonly string _configuration;
    private readonly int _maxRetries;
    private readonly TimeSpan _retryDelay;

    public RedisConnectionFactory(string configuration, int maxRetries = 5, int retryDelayMilliseconds = 1000)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _maxRetries = maxRetries;
        _retryDelay = TimeSpan.FromMilliseconds(retryDelayMilliseconds);
    }

    public async Task<IConnectionMultiplexer> GetConnectionAsync()
    {
        for (int attempt = 0; attempt < _maxRetries; attempt++)
        {
            try
            {
                var connection = await ConnectionMultiplexer.ConnectAsync(_configuration);
                return connection;
            }
            catch (RedisConnectionException)
            {
                if (attempt == _maxRetries - 1)
                {
                    throw; // Rethrow after max retries
                }
                await Task.Delay(_retryDelay);
            }
        }

        throw new InvalidOperationException("Could not connect to Redis after multiple attempts.");
    }
}
