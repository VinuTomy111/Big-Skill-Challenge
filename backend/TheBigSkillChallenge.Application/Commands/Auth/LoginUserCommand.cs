using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheBigSkillChallenge.Application.DTOs;

namespace TheBigSkillChallenge.Application.Commands.Auth
{
    public class LoginUserCommand : IRequest<AuthResponseDto>
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
