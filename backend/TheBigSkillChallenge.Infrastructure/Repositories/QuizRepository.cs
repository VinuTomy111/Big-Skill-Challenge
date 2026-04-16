using Microsoft.EntityFrameworkCore;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Domain.Entities;
using TheBigSkillChallenge.Infrastructure.Data;

namespace TheBigSkillChallenge.Infrastructure.Repositories;

public class QuizRepository : IQuizRepository
{
    private readonly AppDbContext _context;

    public QuizRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<QuizSession?> GetSessionAsync(Guid userId, Guid competitionId)
    {
        return await _context.QuizSessions
            .Where(q => q.CompletedAt == null && q.IsTimedOut == false && q.IsSuccessful == false)
            .FirstOrDefaultAsync(q => q.UserId == userId && q.CompetitionId == competitionId);
    }

    public async Task<QuizSession?> GetSessionByIdAsync(Guid sessionId)
    {
        return await _context.QuizSessions.FindAsync(sessionId);
    }

    public async Task AddSessionAsync(QuizSession session)
    {
        await _context.QuizSessions.AddAsync(session);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateSessionAsync(QuizSession session)
    {
        _context.QuizSessions.Update(session);
        await _context.SaveChangesAsync();
    }

    public async Task MarkSessionAsTimeoutAsync(Guid sessionId)
    {
        var session = await _context.QuizSessions.FindAsync(sessionId);
        if (session != null)
        {
            session.IsTimedOut = true;
            session.CompletedAt = DateTime.UtcNow;
            
            _context.QuizSessions.Update(session);
            await _context.SaveChangesAsync();
        }
    }

    public async Task AddAnswerAsync(QuizAnswer answer)
    {
        await _context.QuizAnswers.AddAsync(answer);
        await _context.SaveChangesAsync();
    }

    public async Task<QuizQuestion?> GetQuestionAsync(Guid questionId)
    {
        return await _context.QuizQuestions.FindAsync(questionId);
    }

    public async Task<int> GetTotalQuestionsForCompetitionAsync(Guid competitionId)
    {
        return await _context.CompetitionQuestions
            .CountAsync(cq => cq.CompetitionId == competitionId);
    }

    public async Task<int> GetAnsweredQuestionsCountAsync(Guid quizSessionId)
    {
        return await _context.QuizAnswers
            .CountAsync(qa => qa.QuizSessionId == quizSessionId);
    }

    public async Task<int> GetSessionAttemptsCountAsync(Guid userId, Guid competitionId)
    {
        return await _context.QuizSessions
            .CountAsync(q => q.UserId == userId && q.CompetitionId == competitionId);
    }
}
