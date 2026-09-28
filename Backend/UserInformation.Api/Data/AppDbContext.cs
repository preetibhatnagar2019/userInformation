using Microsoft.EntityFrameworkCore;
using UserInformation.Api.Models;

namespace UserInformation.Api.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
}