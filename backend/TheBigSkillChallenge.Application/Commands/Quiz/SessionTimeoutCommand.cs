using MediatR;

namespace TheBigSkillChallenge.Application.Commands.Quiz;

public class SessionTimeoutCommand : IRequest<SessionTimeoutResponse>
{
    public Guid SessionId { get; set; }
}

public class SessionTimeoutResponse 
{
    public string Message { get; set; } = string.Empty;
}
