using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Application.Interfaces;

public interface ICompetitionQuestionsRepository
{
    Task<IEnumerable<QuizQuestion>> GetRandomQuestionsAsync(Guid competitionId);
}
