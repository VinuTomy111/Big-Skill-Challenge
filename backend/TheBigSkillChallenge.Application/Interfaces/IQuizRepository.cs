using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Application.Interfaces;

public interface IQuizRepository
{
    Task<QuizSession?> GetSessionAsync(Guid userId, Guid competitionId);
    Task<QuizSession?> GetSessionByIdAsync(Guid sessionId);
    Task AddSessionAsync(QuizSession session);
    Task UpdateSessionAsync(QuizSession session);
    
    Task AddAnswerAsync(QuizAnswer answer);
    
    Task<QuizQuestion?> GetQuestionAsync(Guid questionId);
    Task<int> GetTotalQuestionsForCompetitionAsync(Guid competitionId);
    Task<int> GetAnsweredQuestionsCountAsync(Guid quizSessionId);
}
