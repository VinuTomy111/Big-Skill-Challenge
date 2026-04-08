using MediatR;
using TheBigSkillChallenge.Application.DTOs;

namespace TheBigSkillChallenge.Application.Queries;

public class GetCompetitionQuestionsQuery : IRequest<IEnumerable<QuizQuestionDto>>
{
    public Guid CompetitionId { get; set; }
}
