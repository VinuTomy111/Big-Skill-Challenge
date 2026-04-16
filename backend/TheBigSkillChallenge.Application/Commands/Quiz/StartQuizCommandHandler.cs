using MediatR;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Application.Commands.Quiz;

public class StartQuizCommandHandler : IRequestHandler<StartQuizCommand, StartQuizResponseDto>
{
    private readonly IQuizRepository _quizRepository;
    private readonly IAuditLogService _auditLogService;

    public StartQuizCommandHandler(IQuizRepository quizRepository, IAuditLogService auditLogService)
    {
        _quizRepository = quizRepository;
        _auditLogService = auditLogService;
    }

    public async Task<StartQuizResponseDto> Handle(StartQuizCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Check attempt limit
            var attemptCount = await _quizRepository.GetSessionAttemptsCountAsync(request.UserId, request.CompetitionId);
            if (attemptCount >= 10)
            {
                await _auditLogService.LogAsync("Quiz Attempt Limit Reached", "Quiz", $"User {request.UserId} reached the 10 attempt limit for competition {request.CompetitionId}.", request.UserId);
                throw new Exception("Maximum quiz attempts reached.");
            }

            // Check if an active session already exists
            var existingSession = await _quizRepository.GetSessionAsync(request.UserId, request.CompetitionId);
            if (existingSession != null)
            {
                throw new Exception("You already have an active quiz session for this competition.");
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

            await _auditLogService.LogAsync("Quiz Session Started", "Quiz", $"Session {session.Id} started by user {request.UserId} for competition {request.CompetitionId}", request.UserId);

            return new StartQuizResponseDto(session.Id, session.StartedAt, 30); // 30 sec default timeout
        }
        catch(Exception ex)
        {
            await _auditLogService.LogAsync("Quiz Session Started ", "Quiz", $"Session Start failed : {ex.Message}");
            throw;
        }
    }
}
