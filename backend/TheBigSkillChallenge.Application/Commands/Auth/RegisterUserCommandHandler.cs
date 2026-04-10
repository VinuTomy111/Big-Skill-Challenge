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
    private readonly IEmailService _emailService;
    private readonly IAuditLogService _auditLogService;

    public RegisterUserCommandHandler(
        IUserRepository userRepository, 
        ITokenProvider tokenProvider,
        IPasswordHasher passwordHasher, 
        IEmailService emailService,
        IAuditLogService auditLogService)
    {
        _userRepository = userRepository;
        _tokenProvider = tokenProvider;
        _passwordHasher = passwordHasher;
        _emailService = emailService;
        _auditLogService = auditLogService;
    }

    public async Task<AuthResponseDto> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Check if user exists
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new Exception("User already exists with this email.");
            }

            // Generate 4 digit OTP
            var otp = new Random().Next(1000, 9999).ToString();

            var expiryTime = DateTime.UtcNow.AddMinutes(5);

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Phone = request.Phone,
                Country = request.Country,
                PasswordHash = _passwordHasher.Hash(request.Password),
                OtpCode = otp,
                OtpExpiry = expiryTime,
                IsEmailVerified = false // Needs OTP
            };

            await _userRepository.AddAsync(user);

            await _emailService.SendOtpEmail(user.Email, otp);

            await _auditLogService.LogAsync("User Registration", "Auth", $"Registered successfully: {user.Id}", user.Id);

            return new AuthResponseDto(user.Id, null, "Registration successful. Please verify OTP.");
        }
        catch (Exception ex)
        {
            await _auditLogService.LogAsync("User Registration", "Auth", $"Registration failure for {request.Email}: {ex.Message}");
            throw;
        }
    }
}
