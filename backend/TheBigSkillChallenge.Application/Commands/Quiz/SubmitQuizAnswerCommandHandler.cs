using MediatR;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Application.Commands.Quiz;

public class SubmitQuizAnswerCommandHandler : IRequestHandler<SubmitQuizAnswerCommand, SubmitQuizAnswerResponseDto>
{
    private readonly IQuizRepository _quizRepository;
    private readonly IAuditLogService _auditLogService;

    public SubmitQuizAnswerCommandHandler(IQuizRepository quizRepository, IAuditLogService auditLogService)
    {
        _quizRepository = quizRepository;
        _auditLogService = auditLogService;
    }

    public async Task<SubmitQuizAnswerResponseDto> Handle(SubmitQuizAnswerCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var session = await _quizRepository.GetSessionByIdAsync(request.QuizSessionId);
            if (session == null) throw new Exception("Quiz session not found.");

            if (session.CompletedAt.HasValue || session.IsTimedOut)
            {
                return new SubmitQuizAnswerResponseDto(false, "Quiz already completed or timed out.", true, session.IsSuccessful, session.IsTimedOut);
            }

            // 1. Timeout Checking (5 Minutes)
            if (DateTime.UtcNow > session.StartedAt.AddMinutes(5))
            {
                session.IsTimedOut = true;
                session.CompletedAt = DateTime.UtcNow;
                session.IsSuccessful = false;
                await _quizRepository.UpdateSessionAsync(session);

                await _auditLogService.LogAsync("Wrong Answer / Session Failed", "Quiz", $"Session {session.Id} timed out and failed.", session.UserId);

                return new SubmitQuizAnswerResponseDto(false, "Time limit exceeded. Quiz failed.", true, false, true);
            }

            // 2. Validate Question
            var question = await _quizRepository.GetQuestionAsync(request.QuizQuestionId);
            if (question == null) throw new Exception("Question not found.");

            bool isCorrect = string.Equals(question.CorrectAnswer.Trim(), request.SubmittedAnswer.Trim(), StringComparison.OrdinalIgnoreCase);

            // 3. Save Answer
            var answer = new QuizAnswer
            {
                QuizSessionId = request.QuizSessionId,
                QuizQuestionId = request.QuizQuestionId,
                SubmittedAnswer = request.SubmittedAnswer,
                IsCorrect = isCorrect,
                SubmittedAt = DateTime.UtcNow
            };
            await _quizRepository.AddAnswerAsync(answer);

            await _auditLogService.LogAsync("Answer Submitted", "Quiz", $"User submitted answer for question {request.QuizQuestionId} in session {session.Id}", session.UserId);

            // 4. If answer is WRONG ? End quiz immediately
            if (!isCorrect)
            {
                session.CompletedAt = DateTime.UtcNow;
                session.IsSuccessful = false;

                await _quizRepository.UpdateSessionAsync(session);

                await _auditLogService.LogAsync("Wrong Answer / Session Failed", "Quiz", $"Wrong answer for question {request.QuizQuestionId}. Session {session.Id} failed.", session.UserId);

                return new SubmitQuizAnswerResponseDto(
                    IsCorrect: false,
                    Message: "Wrong answer. Quiz ended.",
                    QuizCompleted: true,
                    QuizPassed: false,
                    TimedOut: false
                );
            }


            // 5. Check if Quiz is Completed
            var totalQuestions = 10;
            var answeredQuestions = await _quizRepository.GetAnsweredQuestionsCountAsync(session.Id);

            bool isCompleted = answeredQuestions >= totalQuestions;
            bool isPassed = false;

            if (isCompleted)
            {
                isPassed = isCorrect;

                session.CompletedAt = DateTime.UtcNow;
                session.IsSuccessful = isPassed;
                await _quizRepository.UpdateSessionAsync(session);

                if (isPassed)
                {
                    await _auditLogService.LogAsync("Quiz Completed Successfully", "Quiz", $"Session {session.Id} completed successfully.", session.UserId);
                }
            }

            return new SubmitQuizAnswerResponseDto(
                IsCorrect: isCorrect,
                Message: isCorrect ? "Answer recorded." : "Incorrect answer.",
                QuizCompleted: isCompleted,
                QuizPassed: isPassed,
                TimedOut: false
            );
        }
        catch (Exception ex)
        {
            await _auditLogService.LogAsync("Answer Summit Session", "Quiz", $"Answer Summit failed : {ex.Message}");
            throw;
        }
    }
}
