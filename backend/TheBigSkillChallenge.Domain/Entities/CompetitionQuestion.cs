namespace TheBigSkillChallenge.Domain.Entities;

public class CompetitionQuestion
{
    public Guid CompetitionId { get; set; }
    public Competition? Competition { get; set; }
    
    public Guid QuizQuestionId { get; set; }
    public QuizQuestion? QuizQuestion { get; set; }
}
