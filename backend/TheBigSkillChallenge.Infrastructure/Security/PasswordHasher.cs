using Microsoft.AspNetCore.Identity;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Infrastructure.Security;

public class PasswordHasher : IPasswordHasher
{
    private readonly PasswordHasher<User> _hasher;

    public PasswordHasher()
    {
        _hasher = new PasswordHasher<User>();
    }

    public string Hash(string password)
    {
        // Notice we pass null for user in this simple implementation
        return _hasher.HashPassword(null!, password);
    }

    public bool Verify(string password, string hash)
    {
        var result = _hasher.VerifyHashedPassword(null!, hash, password);
        return result != PasswordVerificationResult.Failed;
    }
}
