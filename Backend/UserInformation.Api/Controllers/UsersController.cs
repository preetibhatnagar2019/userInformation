using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserInformation.Api.Contracts;
using UserInformation.Api.Data;
using UserInformation.Api.Models;

namespace UserInformation.Api.Controllers;

[ApiController]
[Route("api/users")]
public sealed class UsersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers(CancellationToken cancellationToken)
    {
        return Ok(await db.Users.AsNoTracking().OrderBy(user => user.Id).ToListAsync(cancellationToken));
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<User>> GetUser(int id, CancellationToken cancellationToken)
    {
        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Id == id, cancellationToken);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(UserRequest request, CancellationToken cancellationToken)
    {
        var user = new User
        {
            Name = request.Name.Trim(),
            Age = request.Age,
            City = request.City.Trim(),
            State = request.State.Trim(),
            Pincode = request.Pincode.Trim()
        };

        db.Users.Add(user);
        await db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, UserRequest request, CancellationToken cancellationToken)
    {
        var user = await db.Users.FindAsync(new object[] { id }, cancellationToken);
        if (user is null)
        {
            return NotFound();
        }

        user.Name = request.Name.Trim();
        user.Age = request.Age;
        user.City = request.City.Trim();
        user.State = request.State.Trim();
        user.Pincode = request.Pincode.Trim();
        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id, CancellationToken cancellationToken)
    {
        var user = await db.Users.FindAsync(new object[] { id }, cancellationToken);
        if (user is null)
        {
            return NotFound();
        }

        db.Users.Remove(user);
        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}