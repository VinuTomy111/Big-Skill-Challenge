namespace TheBigSkillChallenge.Domain.Entities;

public class QuizQuestion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string QuestionText { get; set; } = string.Empty;
    public string CorrectAnswer { get; set; } = string.Empty;
    public string OptionsJson { get; set; } = string.Empty; // JSON array of options

    public ICollection<CompetitionQuestion>? CompetitionQuestions { get; set; }
}
