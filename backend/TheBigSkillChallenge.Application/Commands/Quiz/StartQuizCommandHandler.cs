using MediatR;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Application.Commands.Quiz;

public class StartQuizCommandHandler : IRequestHandler<StartQuizCommand, StartQuizResponseDto>
{
    private readonly IQuizRepository _quizRepository;

    public StartQuizCommandHandler(IQuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }

    public async Task<StartQuizResponseDto> Handle(StartQuizCommand request, CancellationToken cancellationToken)
    {
        // Check if a session already exists (Only 1 attempt allowed)
        var existingSession = await _quizRepository.GetSessionAsync(request.UserId, request.CompetitionId);
        if (existingSession != null)
        {
            throw new Exception("You have already attempted the quiz for this competition. Only 1 attempt is allowed.");
        }

        var session = new QuizSession
        {
            UserId = request.UserId,
            CompetitionId = request.CompetitionId,
            StartedAt = DateTime.UtcNow,
            IsSuccessful = false,
            IsTimedOut = false
        };

        await _quizRepository.AddSessionAsync(session);

        return new StartQuizResponseDto(session.Id, session.StartedAt, 5); // 5 minutes default timeout
    }
}
