namespace TheBigSkillChallenge.Domain.Entities;

public class QuizAnswer
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid QuizSessionId { get; set; }
    public QuizSession? QuizSession { get; set; }
    
    public Guid QuizQuestionId { get; set; }
    public QuizQuestion? QuizQuestion { get; set; }
    
    public string SubmittedAnswer { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
