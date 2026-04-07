using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheBigSkillChallenge.Application.Commands.Auth
{
    public record VerifyOtpCommand(string Email, string Otp) : IRequest<string>;
}
