using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheBigSkillChallenge.Application.DTOs;
using TheBigSkillChallenge.Application.Interfaces;

namespace TheBigSkillChallenge.Application.Commands.Auth
{
    public class VerifyOtpCommandHandler : IRequestHandler<VerifyOtpCommand, AuthResponseDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenProvider _tokenProvider;
        private readonly IAuditLogService _auditLogService;

        public VerifyOtpCommandHandler(IUserRepository userRepository, ITokenProvider tokenProvider, IAuditLogService auditLogService)
        {
            _userRepository = userRepository;
            _tokenProvider = tokenProvider;
            _auditLogService = auditLogService;
        }

        public async Task<AuthResponseDto> Handle(VerifyOtpCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(request.Email);

                if (user == null)
                    throw new Exception("User not found");

                if (user.OtpCode != request.Otp)
                    throw new Exception("Invalid OTP");

                if (user.OtpExpiry < DateTime.UtcNow)
                    throw new Exception("OTP expired");

                user.IsEmailVerified = true;
                user.OtpCode = null;

                await _userRepository.UpdateAsync(user);

                var token = _tokenProvider.GenerateToken(user);

                await _auditLogService.LogAsync("OTP Verification Success", "Auth", $"OTP verified for user: {user.Id}", user.Id);

                return new AuthResponseDto(user.Id, token, "Email verified successfully");
            }
            catch (Exception ex)
            {
                await _auditLogService.LogAsync("OTP Verification Failure", "Auth", $"OTP verification failed for {request.Email}: {ex.Message}");
                throw;
            }
        }
    }
}
