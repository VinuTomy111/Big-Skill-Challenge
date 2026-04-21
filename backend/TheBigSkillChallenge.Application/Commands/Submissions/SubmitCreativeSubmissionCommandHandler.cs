using MediatR;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Application.DTOs;
using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Application.Commands.Submissions;

public class SubmitCreativeSubmissionCommandHandler : IRequestHandler<SubmitCreativeSubmissionCommand, CreativeSubmissionResponseDto>
{
    private readonly IQuizRepository _quizRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAiSentimentService _aiSentimentService;
    private readonly ISentimentAnalysisRepository _sentimentRepository;
    private readonly IEmailService _emailService;
    private readonly IAuditLogService _auditLogService;

    public SubmitCreativeSubmissionCommandHandler(
        IQuizRepository quizRepository,
        IUserRepository userRepository,
        IAiSentimentService aiSentimentService,
        ISentimentAnalysisRepository sentimentRepository,
        IEmailService emailService,
        IAuditLogService auditLogService)
    {
        _quizRepository = quizRepository;
        _userRepository = userRepository;
        _aiSentimentService = aiSentimentService;
        _sentimentRepository = sentimentRepository;
        _emailService = emailService;
        _auditLogService = auditLogService;
    }

    public async Task<CreativeSubmissionResponseDto> Handle(SubmitCreativeSubmissionCommand request, CancellationToken cancellationToken)
    {
        await _auditLogService.LogAsync("Creative Submission Attempt", "CreativeSubmission", $"User {request.UserId} attempting submission for session {request.QuizSessionId}", request.UserId);

        var session = await _quizRepository.GetSessionByIdAsync(request.QuizSessionId);
        if (session == null || session.UserId != request.UserId)
        {
            await _auditLogService.LogAsync("Creative Submission Validation Failure", "CreativeSubmission", $"Session {request.QuizSessionId} not found or unauthorized.", request.UserId);
            throw new UnauthorizedAccessException("Quiz session not found or unauthorized.");
        }

        if (!session.IsSuccessful)
        {
            await _auditLogService.LogAsync("Creative Submission Validation Failure", "CreativeSubmission", "Quiz was not successful.", request.UserId);
            throw new InvalidOperationException("Submission is allowed only after the quiz session is successfully completed.");
        }

        if (await _sentimentRepository.HasSubmissionForSessionAsync(request.QuizSessionId))
        {
            await _auditLogService.LogAsync("Creative Submission Validation Failure", "CreativeSubmission", "Submission already exists for this session.", request.UserId);
            throw new InvalidOperationException("A submission has already been made for this session.");
        }

        string normalizedString = string.Join(" ", request.Text.Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries));
        int wordCount = string.IsNullOrWhiteSpace(normalizedString) ? 0 : normalizedString.Split(' ').Length;

        if (wordCount != 25)
        {
            await _auditLogService.LogAsync("Creative Submission Validation Failure", "CreativeSubmission", $"Word count invalid. Count: {wordCount}", request.UserId);
            throw new ArgumentException($"The response must contain exactly 25 words. Found: {wordCount}");
        }

        double score;
        try
        {
            score = await _aiSentimentService.GetSentimentScoreAsync(normalizedString);
        }
        catch (Exception ex)
        {
            await _auditLogService.LogAsync("AI Sentiment Scoring Failure", "CreativeSubmission", $"AI Service failed: {ex.Message}", request.UserId);
            throw new InvalidOperationException("Failed to get sentiment score from AI Service.");
        }

        string category = GetScoreCategory(score);

        var submission = new SentimentAnalysis
        {
            UserId = request.UserId,
            QuizSessionId = request.QuizSessionId,
            SubmissionText = normalizedString,
            WordCount = wordCount,
            SentimentScore = score,
            ScoreCategory = category,
            ReferenceNumber = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow
        };

        await _sentimentRepository.AddAsync(submission);

        //var user = await _userRepository.GetByIdAsync(request.UserId);
        //if (user != null)
        //{
        //    string emailBody = $"Your entry has been accepted.\nReference Number: {submission.ReferenceNumber}\nWord Count: 25/25\nSubmitted At: {submission.CreatedAt}";
        //    await _emailService.SendEmailAsync(user.Email, "Creative Submission Accepted", emailBody);
        //}

        await _auditLogService.LogAsync("Creative Submission Success", "CreativeSubmission", $"Submission mapped to reference {submission.ReferenceNumber} with score {score}", request.UserId);

        return new CreativeSubmissionResponseDto
        {
            Message = "Entry Accepted",
            WordCount = "25/25",
            ReferenceNumber = submission.ReferenceNumber,
            SubmittedAt = submission.CreatedAt,
            Status = "Entry Recorded",
            SentimentScore = score,
            Category = category
        };
    }

    private string GetScoreCategory(double score)
    {
        if (score <= 3) return "Low quality response";
        if (score <= 6) return "Average response";
        if (score <= 8) return "Strong response";
        return "Excellent response";
    }
}
