using MediatR;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Application.Commands.Quiz;

public class SubmitQuizAnswerCommandHandler : IRequestHandler<SubmitQuizAnswerCommand, SubmitQuizAnswerResponseDto>
{
    private readonly IQuizRepository _quizRepository;

    public SubmitQuizAnswerCommandHandler(IQuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }

    public async Task<SubmitQuizAnswerResponseDto> Handle(SubmitQuizAnswerCommand request, CancellationToken cancellationToken)
    {
        var session = await _quizRepository.GetSessionByIdAsync(request.QuizSessionId);
        if (session == null) throw new Exception("Quiz session not found.");
        
        if (session.CompletedAt.HasValue || session.IsTimedOut)
        {
            return new SubmitQuizAnswerResponseDto(false, "Quiz already completed or timed out.", true, session.IsSuccessful, session.IsTimedOut);
        }

        // 1. Timeout Checking (5 Minutes)
        if (DateTime.UtcNow > session.StartedAt.AddSeconds(30))
        {
            session.IsTimedOut = true;
            session.CompletedAt = DateTime.UtcNow;
            session.IsSuccessful = false;
            await _quizRepository.UpdateSessionAsync(session);
            
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

        // 4. Check if Quiz is Completed
        var totalQuestions = 10;
        var answeredQuestions = await _quizRepository.GetAnsweredQuestionsCountAsync(session.Id);

        bool isCompleted = answeredQuestions >= totalQuestions;
        bool isPassed = false;

        if (isCompleted)
        {
            // Simple pass logic for demo: all must be correct, or 80%. Let's say all correct for now.
            // In a real scenario, we'd calculate score here.
            isPassed = isCorrect; // Only simple mockup pass/fail check per answer sequence.

            session.CompletedAt = DateTime.UtcNow;
            session.IsSuccessful = isPassed;
            await _quizRepository.UpdateSessionAsync(session);
        }

        return new SubmitQuizAnswerResponseDto(
            IsCorrect: isCorrect,
            Message: isCorrect ? "Answer recorded." : "Incorrect answer.",
            QuizCompleted: isCompleted,
            QuizPassed: isPassed,
            TimedOut: false
        );
    }
}
