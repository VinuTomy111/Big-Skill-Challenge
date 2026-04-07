using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheBigSkillChallenge.Application.Interfaces;

namespace TheBigSkillChallenge.Application.Commands.Auth
{
    public class VerifyOtpCommandHandler : IRequestHandler<VerifyOtpCommand, string>
    {
        private readonly IUserRepository _userRepository;

        public VerifyOtpCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<string> Handle(VerifyOtpCommand request, CancellationToken cancellationToken)
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

            return "Email verified successfully";
        }
    }
}
