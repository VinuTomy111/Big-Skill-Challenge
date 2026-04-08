using Microsoft.EntityFrameworkCore;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Domain.Entities;
using TheBigSkillChallenge.Infrastructure.Data;

namespace TheBigSkillChallenge.Infrastructure.Repositories;

public class CompetitionRepository : ICompetitionRepository
{
    private readonly AppDbContext _context;

    public CompetitionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Competition>> GetAllCompetitionsAsync()
    {
        return await _context.Competitions.ToListAsync();
    }
}
