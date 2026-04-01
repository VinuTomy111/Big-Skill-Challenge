namespace TheBigSkillChallenge.Domain.Entities;

public class Entry
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }
    
    public Guid CompetitionId { get; set; }
    public Competition? Competition { get; set; }
    
    public string SubmissionText { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public AIValidationResult? ValidationResult { get; set; }
}
