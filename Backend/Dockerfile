FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY UserInformation.Api/UserInformation.Api.csproj UserInformation.Api/
RUN dotnet restore UserInformation.Api/UserInformation.Api.csproj
COPY UserInformation.Api/ UserInformation.Api/
RUN dotnet publish UserInformation.Api/UserInformation.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "UserInformation.Api.dll"]