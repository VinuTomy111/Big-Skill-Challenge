namespace TheBigSkillChallenge.Domain.Entities;

public class Competition
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CompetitionQuestion>? CompetitionQuestions { get; set; }
    public ICollection<Entry>? Entries { get; set; }
}
