# Use the official ASP.NET Core runtime as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY Veloce1600Api.csproj ./
RUN dotnet restore

# Copy the entire project and build
COPY . .
WORKDIR /src
RUN dotnet build Veloce1600Api.csproj -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish Veloce1600Api.csproj -c Release -o /app/publish

# Final stage to run the application
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Veloce1600Api.dll"]
