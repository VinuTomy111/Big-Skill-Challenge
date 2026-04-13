using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Application.Interfaces;

public interface ISentimentAnalysisRepository
{
    Task<SentimentAnalysis> AddAsync(SentimentAnalysis sentimentAnalysis);
    Task<bool> HasSubmissionForSessionAsync(Guid quizSessionId);
}
