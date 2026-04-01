using MediatR;

namespace TheBigSkillChallenge.Application.Commands.Quiz;

public record SubmitQuizAnswerCommand(
    Guid QuizSessionId,
    Guid QuizQuestionId,
    string SubmittedAnswer
) : IRequest<SubmitQuizAnswerResponseDto>;

public record SubmitQuizAnswerResponseDto(
    bool IsCorrect,
    string Message,
    bool QuizCompleted,
    bool QuizPassed,
    bool TimedOut
);
