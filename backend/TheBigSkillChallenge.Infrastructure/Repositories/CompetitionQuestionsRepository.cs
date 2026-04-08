using Microsoft.EntityFrameworkCore;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Domain.Entities;
using TheBigSkillChallenge.Infrastructure.Data;

namespace TheBigSkillChallenge.Infrastructure.Repositories;

public class CompetitionQuestionsRepository : ICompetitionQuestionsRepository
{
    private readonly AppDbContext _context;

    public CompetitionQuestionsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<QuizQuestion>> GetRandomQuestionsAsync(Guid competitionId)
    {
        return await _context.CompetitionQuestions
            .Where(cq => cq.CompetitionId == competitionId)
            .Include(cq => cq.QuizQuestion)
            .Select(cq => cq.QuizQuestion!)
            .OrderBy(q => Guid.NewGuid())
            .Take(10)
            .ToListAsync();
    }
}
