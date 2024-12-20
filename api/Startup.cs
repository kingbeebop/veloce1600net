using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using System;
using System.Text;
using System.Threading.Tasks;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        // Load environment variables if needed
        DotNetEnv.Env.Load();

        // Configure CORS policy
        ConfigureCors(services);

        // Set up database context
        ConfigureDatabase(services);

        // Configure Identity
        ConfigureIdentity(services);

        // Configure authentication
        ConfigureAuthentication(services);

        // Add authorization services
        services.AddAuthorization();

        // Register application services and repositories
        ConfigureServicesAndRepositories(services);

        // Configure Redis
        ConfigureRedis(services);

        // Set up Swagger for API documentation
        ConfigureSwagger(services);

        // Add controllers with JSON serialization
        services.AddControllers()
                .AddNewtonsoftJson();
    }

    private void ConfigureCors(IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
        });
    }

    private void ConfigureDatabase(IServiceCollection services)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));
    }

    private void ConfigureIdentity(IServiceCollection services)
    {
        services.AddIdentity<User, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();
    }

    private void ConfigureAuthentication(IServiceCollection services)
    {
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = Configuration["Jwt:Issuer"],
                ValidAudience = Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
            };

            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                    return Task.CompletedTask;
                }
            };
        });
    }

    private void ConfigureServicesAndRepositories(IServiceCollection services)
    {
        services.AddScoped<ICarRepository, CarRepository>();
        services.AddScoped<CarService>();
        services.AddSingleton<ITokenRepository, TokenRepository>();
        services.AddScoped<IFileUploadService, FileUploadService>();
        services.AddScoped<DatabaseInitializer>();
        services.AddScoped<IRedisService, RedisService>();
    }

    private void ConfigureRedis(IServiceCollection services)
    {
        // Read Redis configuration from appsettings.json or environment variables
        var redisConfiguration = Configuration["Redis:ConnectionString"];
        
        // Ensure the configuration string is not null or empty
        if (string.IsNullOrEmpty(redisConfiguration))
        {
            throw new InvalidOperationException("Redis connection string is not configured.");
        }

        services.AddSingleton<IRedisConnectionFactory>(provider =>
            new RedisConnectionFactory(redisConfiguration)); // Pass the configuration string here

        services.AddSingleton<IConnectionMultiplexer>(provider =>
        {
            var factory = provider.GetRequiredService<IRedisConnectionFactory>();
            return factory.GetConnectionAsync().GetAwaiter().GetResult(); // Ensure it returns the connection synchronously
        });
    }

    private void ConfigureSwagger(IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Car API", Version = "v1" });
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // Error handling middleware
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }

        // Middleware pipeline
        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseCors("AllowAllOrigins");
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseStaticFiles();

        // Swagger UI setup
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Car API v1");
            c.RoutePrefix = string.Empty; 
        });

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers(); 
        });

        // Uncomment if you want to apply migrations automatically and seed data
        // ApplyMigrations(app);
    }

    // Optional: Refactor the migration and seeding logic into a method
    // private void ApplyMigrations(IApplicationBuilder app)
    // {
    //     using (var scope = app.ApplicationServices.CreateScope())
    //     {
    //         var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    //         dbContext.Database.Migrate(); // Apply any pending migrations
            
    //         // Seed data after migrations
    //         var dbInitializer = scope.ServiceProvider.GetRequiredService<DatabaseInitializer>();
    //         dbInitializer.SeedDataAsync().GetAwaiter().GetResult();
    //     }
    // }
}
