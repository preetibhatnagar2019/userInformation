using System.ComponentModel.DataAnnotations;
using UserInformation.Api.Contracts;
using Xunit;

namespace UserInformation.Api.Tests;

public sealed class UserRequestTests
{
    [Fact]
    public void Valid_user_request_passes_validation()
    {
        var request = new UserRequest
        {
            Name = "Ada Lovelace",
            Age = 36,
            City = "London",
            State = "Greater London",
            Pincode = "12345"
        };

        Assert.Empty(Validate(request));
    }

    [Theory]
    [InlineData("A", 36, "12345")]
    [InlineData("Ada Lovelace", 121, "12345")]
    [InlineData("Ada Lovelace", 36, "123")]
    public void Invalid_fields_fail_validation(string name, int age, string pincode)
    {
        var request = new UserRequest
        {
            Name = name,
            Age = age,
            City = "London",
            State = "Greater London",
            Pincode = pincode
        };

        Assert.NotEmpty(Validate(request));
    }

    [Theory]
    [InlineData("12345", "Greater London")]
    [InlineData("London", "456")]
    public void City_and_state_must_contain_a_letter(string city, string state)
    {
        var request = new UserRequest
        {
            Name = "Ada Lovelace",
            Age = 36,
            City = city,
            State = state,
            Pincode = "12345"
        };

        Assert.NotEmpty(Validate(request));
    }

    private static List<ValidationResult> Validate(UserRequest request)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(request, new ValidationContext(request), results, validateAllProperties: true);
        return results;
    }
}