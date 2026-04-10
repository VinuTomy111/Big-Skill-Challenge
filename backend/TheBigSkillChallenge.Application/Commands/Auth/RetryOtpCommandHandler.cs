using MediatR;
using TheBigSkillChallenge.Application.DTOs;
using TheBigSkillChallenge.Application.Interfaces;

public class RetryOtpCommandHandler : IRequestHandler<RetryOtpCommand, AuthResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly IAuditLogService _auditLogService;

    public RetryOtpCommandHandler(IUserRepository userRepository, IEmailService emailService, IAuditLogService auditLogService)
    {
        _userRepository = userRepository;
        _emailService = emailService;
        _auditLogService = auditLogService;
    }

    public async Task<AuthResponseDto> Handle(RetryOtpCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null)
                throw new Exception("User not found");

            if (user.IsEmailVerified)
                throw new Exception("Email already verified");

            var otp = new Random().Next(1000, 9999).ToString();

            user.OtpCode = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(5);

            await _userRepository.UpdateAsync(user);

            await _emailService.SendOtpEmail(user.Email, otp);

            await _auditLogService.LogAsync("Retry OTP Success", "Auth", $"OTP resent for user: {user.Id}", user.Id);

            return new AuthResponseDto(user.Id, null, "OTP resent successfully");
        }
        catch (Exception ex)
        {
            await _auditLogService.LogAsync("Retry OTP Failure", "Auth", $"Retry OTP failed for {request.Email}: {ex.Message}");
            throw;
        }
    }
}