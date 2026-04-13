namespace TheBigSkillChallenge.Application.DTOs;

public class CreativeSubmissionResponseDto
{
    public string Message { get; set; } = string.Empty;
    public string WordCount { get; set; } = string.Empty;
    public Guid ReferenceNumber { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public double SentimentScore { get; set; }
    public string Category { get; set; } = string.Empty;
}
