using MediatR;

namespace TheBigSkillChallenge.Application.Commands.Quiz;

public record StartQuizCommand(
    Guid UserId,
    Guid CompetitionId
) : IRequest<StartQuizResponseDto>;

public record StartQuizResponseDto(
    Guid QuizSessionId,
    DateTime StartedAt,
    int TimeoutSeconds
);
