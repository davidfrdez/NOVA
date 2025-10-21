using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Portal.Api.Extensions;

/// <summary>
/// Lightweight DataAnnotations validator to avoid external dependencies.
/// </summary>
public static class MiniValidator
{
    public static bool TryValidate<T>(T instance, out IDictionary<string, string[]> errors)
    {
        var context = new ValidationContext(instance!);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(instance!, context, results, true);

        errors = results
            .SelectMany(result => result.MemberNames.Select(member => (member, Message: result.ErrorMessage ?? "Validation error")))
            .GroupBy(tuple => tuple.member)
            .ToDictionary(group => group.Key, group => group.Select(tuple => tuple.Message).ToArray());

        return isValid;
    }
}
