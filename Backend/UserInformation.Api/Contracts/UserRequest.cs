using System.ComponentModel.DataAnnotations;

namespace UserInformation.Api.Contracts;

public sealed class UserRequest
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; init; } = string.Empty;

    [Range(0, 120)]
    public int Age { get; init; }

    [Required, RegularExpression(@".*\p{L}.*", ErrorMessage = "City must include at least one letter.")]
    public string City { get; init; } = string.Empty;

    [Required, RegularExpression(@".*\p{L}.*", ErrorMessage = "State must include at least one letter.")]
    public string State { get; init; } = string.Empty;

    [Required, StringLength(10, MinimumLength = 4)]
    public string Pincode { get; init; } = string.Empty;
}