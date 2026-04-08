using MediatR;
using TheBigSkillChallenge.Application.DTOs;

public record RetryOtpCommand(string Email) : IRequest<AuthResponseDto>;