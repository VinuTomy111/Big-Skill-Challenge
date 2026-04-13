namespace TheBigSkillChallenge.Application.Interfaces;

public interface IAiSentimentService
{
    Task<double> GetSentimentScoreAsync(string text);
}
