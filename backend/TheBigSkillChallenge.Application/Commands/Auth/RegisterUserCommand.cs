using MediatR;
using TheBigSkillChallenge.Application.DTOs;

namespace TheBigSkillChallenge.Application.Commands.Auth;

public record RegisterUserCommand(
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    string Country,
    string Password
) : IRequest<AuthResponseDto>;
