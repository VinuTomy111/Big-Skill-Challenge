using MediatR;
using TheBigSkillChallenge.Application.Interfaces;

namespace TheBigSkillChallenge.Application.Commands.Quiz;

public class SessionTimeoutCommandHandler : IRequestHandler<SessionTimeoutCommand, SessionTimeoutResponse>
{
    private readonly IQuizRepository _quizRepository;
    private readonly IAuditLogService _auditLogService;

    public SessionTimeoutCommandHandler(IQuizRepository quizRepository, IAuditLogService auditLogService)
    {
        _quizRepository = quizRepository;
        _auditLogService = auditLogService;
    }

    public async Task<SessionTimeoutResponse> Handle(SessionTimeoutCommand request, CancellationToken cancellationToken)
    {
        await _quizRepository.MarkSessionAsTimeoutAsync(request.SessionId);

        var session = await _quizRepository.GetSessionByIdAsync(request.SessionId);

        await _auditLogService.LogAsync("Session Timeout Marked", "Quiz", $"Session {request.SessionId} was marked as timed out.", session?.UserId);

        return new SessionTimeoutResponse
        {
            Message = "Session marked as timeout"
        };
    }
}
