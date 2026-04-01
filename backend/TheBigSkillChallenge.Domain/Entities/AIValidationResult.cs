namespace TheBigSkillChallenge.Domain.Entities;

public class AIValidationResult
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EntryId { get; set; }
    public Entry? Entry { get; set; }
    
    public bool IsValid { get; set; }
    public int WordCount { get; set; }
    public double SimilarityScore { get; set; }
    public string StatusMessage { get; set; } = string.Empty;
    public DateTime ValidatedAt { get; set; } = DateTime.UtcNow;
}
