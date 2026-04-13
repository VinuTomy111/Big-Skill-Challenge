namespace TheBigSkillChallenge.Domain.Entities;

public class SentimentAnalysis
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid QuizSessionId { get; set; }
    public string SubmissionText { get; set; } = string.Empty;
    public int WordCount { get; set; }
    public double SentimentScore { get; set; }
    public string ScoreCategory { get; set; } = string.Empty;
    public Guid ReferenceNumber { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public QuizSession? QuizSession { get; set; }
}
