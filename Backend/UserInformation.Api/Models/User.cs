namespace UserInformation.Api.Models;

public sealed class User
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int Age { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }
    public required string Pincode { get; set; }
}