using MediatR;
using TheBigSkillChallenge.Application.DTOs;
using TheBigSkillChallenge.Application.Interfaces;

namespace TheBigSkillChallenge.Application.Queries;

public class GetAllCompetitionsQueryHandler : IRequestHandler<GetAllCompetitionsQuery, IEnumerable<CompetitionDto>>
{
    private readonly ICompetitionRepository _repository;

    public GetAllCompetitionsQueryHandler(ICompetitionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CompetitionDto>> Handle(GetAllCompetitionsQuery request, CancellationToken cancellationToken)
    {
        var competitions = await _repository.GetAllCompetitionsAsync();
        
        return competitions.Select(c => new CompetitionDto
        {
            Id = c.Id,
            Title = c.Title,
            Description = c.Description,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            IsPublished = c.IsPublished
        });
    }
}
