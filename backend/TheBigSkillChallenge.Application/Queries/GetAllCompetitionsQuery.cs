using MediatR;
using TheBigSkillChallenge.Application.DTOs;

namespace TheBigSkillChallenge.Application.Queries;

public class GetAllCompetitionsQuery : IRequest<IEnumerable<CompetitionDto>>
{
}
