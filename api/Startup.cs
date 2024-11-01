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

        // CORS policy configuration
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
        });

        // Database context setup
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

        // Identity setup
        services.AddIdentity<User, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        // Authentication configuration
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

        // Register repositories
        services.AddScoped<ICarRepository, CarRepository>();
        // Register services
        services.AddScoped<CarService>();

        // Swagger configuration
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Car API", Version = "v1" });
        });

        // Controllers with JSON serialization
        services.AddControllers()
                .AddNewtonsoftJson();

        // Dependency Injection for services
        services.AddSingleton<ITokenRepository, TokenRepository>();
        services.AddScoped<FileUploadService>();
        services.AddScoped<DatabaseInitializer>(); // Register DatabaseInitializer

        // Redis Service
        services.AddScoped<IRedisService, RedisService>();

        // Redis configuration using the factory
        services.AddSingleton<IRedisConnectionFactory, RedisConnectionFactory>();
        services.AddSingleton<IConnectionMultiplexer>(provider => 
            provider.GetRequiredService<IRedisConnectionFactory>().GetConnection());
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

        // Swagger UI
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
        // using (var scope = app.ApplicationServices.CreateScope())
        // {
        //     var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        //     dbContext.Database.Migrate(); // Apply any pending migrations
            
        //     // Seed data after migrations
        //     var dbInitializer = scope.ServiceProvider.GetRequiredService<DatabaseInitializer>();
        //     dbInitializer.SeedDataAsync().GetAwaiter().GetResult();
        // }
    }
}
