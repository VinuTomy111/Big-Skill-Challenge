using MediatR;
using TheBigSkillChallenge.Application.Interfaces;

namespace TheBigSkillChallenge.Application.Commands.Quiz;

public class SessionTimeoutCommandHandler : IRequestHandler<SessionTimeoutCommand, SessionTimeoutResponse>
{
    private readonly IQuizRepository _quizRepository;

    public SessionTimeoutCommandHandler(IQuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }

    public async Task<SessionTimeoutResponse> Handle(SessionTimeoutCommand request, CancellationToken cancellationToken)
    {
        await _quizRepository.MarkSessionAsTimeoutAsync(request.SessionId);

        return new SessionTimeoutResponse
        {
            Message = "Session marked as timeout"
        };
    }
}
