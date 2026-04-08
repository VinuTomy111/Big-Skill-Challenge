using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Application.Interfaces;

public interface ICompetitionRepository
{
    Task<IEnumerable<Competition>> GetAllCompetitionsAsync();
}
