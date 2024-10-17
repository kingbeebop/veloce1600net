# Use the official ASP.NET Core runtime as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5018

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY api.csproj ./
RUN dotnet restore

# Copy the entire project and build
COPY . .
WORKDIR /src
RUN dotnet build api.csproj -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish api.csproj -c Release -o /app/publish

# Final stage to run the application
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "api.dll"]
