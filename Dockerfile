FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app
COPY API .
RUN dotnet publish -c Release -o out
ENTRYPOINT ["dotnet", "out/API.dll"]