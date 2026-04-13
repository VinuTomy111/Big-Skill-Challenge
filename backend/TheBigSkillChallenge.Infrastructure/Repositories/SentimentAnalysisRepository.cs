using Microsoft.EntityFrameworkCore;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Domain.Entities;
using TheBigSkillChallenge.Infrastructure.Data;

namespace TheBigSkillChallenge.Infrastructure.Repositories;

public class SentimentAnalysisRepository : ISentimentAnalysisRepository
{
    private readonly AppDbContext _context;

    public SentimentAnalysisRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SentimentAnalysis> AddAsync(SentimentAnalysis sentimentAnalysis)
    {
        _context.SentimentAnalysis.Add(sentimentAnalysis);
        await _context.SaveChangesAsync();
        return sentimentAnalysis;
    }

    public async Task<bool> HasSubmissionForSessionAsync(Guid quizSessionId)
    {
        return await _context.SentimentAnalysis.AnyAsync(s => s.QuizSessionId == quizSessionId);
    }
}
