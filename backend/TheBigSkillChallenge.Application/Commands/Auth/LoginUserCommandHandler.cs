using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheBigSkillChallenge.Application.DTOs;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Application.Commands.Auth
{
    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, AuthResponseDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ITokenProvider _tokenProvider;
        private readonly IAuditLogService _auditLogService;

        public LoginUserCommandHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, ITokenProvider tokenProvider, IAuditLogService auditLogService)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _tokenProvider = tokenProvider;
            _auditLogService = auditLogService;
        }

        public async Task<AuthResponseDto> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(request.Email);

                if (user == null)
                    throw new Exception("Invalid email");

                var validPassword = _passwordHasher.Verify(request.Password, user.PasswordHash);

                if (!validPassword)
                    throw new Exception("Invalid email or password");

                if (!user.IsEmailVerified)
                    throw new Exception("Email not verified");

                var token = _tokenProvider.GenerateToken(user);

                await _auditLogService.LogAsync("Login Success", "Auth", $"User logged in: {user.Id}", user.Id);

                return new AuthResponseDto(user.Id, token, "Login successful");
            }
            catch (Exception ex)
            {
                await _auditLogService.LogAsync("Login Failure", "Auth", $"Login failed for {request.Email}: {ex.Message}");
                throw;
            }
        }
    }
}
