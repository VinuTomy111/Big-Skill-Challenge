namespace TheBigSkillChallenge.Application.DTOs;

public class QuizQuestionDto
{
    public Guid QuestionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string OptionsJson { get; set; } = string.Empty;
    public List<OptionDto> Options { get; set; } = new();
    public string CorrectAnswer { get; set; } = string.Empty;
}
public class OptionDto
{
    public string Key { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
}
