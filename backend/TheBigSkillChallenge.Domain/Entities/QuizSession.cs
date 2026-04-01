namespace TheBigSkillChallenge.Domain.Entities;

public class QuizSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid UserId { get; set; }
    public User? User { get; set; }
    
    public Guid CompetitionId { get; set; }
    public Competition? Competition { get; set; }
    
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    
    public bool IsSuccessful { get; set; }
    public bool IsTimedOut { get; set; }

    public ICollection<QuizAnswer>? Answers { get; set; }
}
