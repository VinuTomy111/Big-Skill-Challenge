namespace TheBigSkillChallenge.Application.DTOs;

public record AuthResponseDto(
    Guid UserId,
    string Token,
    string Message
);
