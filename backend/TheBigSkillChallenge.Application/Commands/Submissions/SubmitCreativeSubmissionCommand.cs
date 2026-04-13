using MediatR;
using TheBigSkillChallenge.Application.DTOs;

namespace TheBigSkillChallenge.Application.Commands.Submissions;

public record SubmitCreativeSubmissionCommand(
    Guid UserId,
    Guid QuizSessionId,
    string Text
) : IRequest<CreativeSubmissionResponseDto>;
