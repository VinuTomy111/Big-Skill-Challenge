using MediatR;
using TheBigSkillChallenge.Application.DTOs;
using TheBigSkillChallenge.Domain.Entities;
using TheBigSkillChallenge.Application.Interfaces;

namespace TheBigSkillChallenge.Application.Commands.Auth;

public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, AuthResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenProvider _tokenProvider;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterUserCommandHandler(
        IUserRepository userRepository, 
        ITokenProvider tokenProvider,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _tokenProvider = tokenProvider;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponseDto> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        // Check if user exists
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new Exception("User already exists with this email.");
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            Country = request.Country,
            PasswordHash = _passwordHasher.Hash(request.Password),
            IsEmailVerified = false // Needs OTP
        };

        await _userRepository.AddAsync(user);

        // Ideally generate OTP here and send email
        var token = _tokenProvider.GenerateToken(user);

        return new AuthResponseDto(user.Id, token, "Registration successful. Please verify OTP.");
    }
}
