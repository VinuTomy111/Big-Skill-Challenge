using MediatR;
using TheBigSkillChallenge.Application.DTOs;
using TheBigSkillChallenge.Application.Interfaces;

public class RetryOtpCommandHandler : IRequestHandler<RetryOtpCommand, AuthResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;

    public RetryOtpCommandHandler(IUserRepository userRepository, IEmailService emailService)
    {
        _userRepository = userRepository;
        _emailService = emailService;
    }

    public async Task<AuthResponseDto> Handle(RetryOtpCommand request, CancellationToken cancellationToken)
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

        return new AuthResponseDto(user.Id, null, "OTP resent successfully");
    }
}