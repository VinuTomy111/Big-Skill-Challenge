using MediatR;
using System.Text.Json;
using TheBigSkillChallenge.Application.DTOs;
using TheBigSkillChallenge.Application.Interfaces;

namespace TheBigSkillChallenge.Application.Queries;

public class GetCompetitionQuestionsQueryHandler : IRequestHandler<GetCompetitionQuestionsQuery, IEnumerable<QuizQuestionDto>>
{
    private readonly ICompetitionQuestionsRepository _repository;

    public GetCompetitionQuestionsQueryHandler(ICompetitionQuestionsRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<QuizQuestionDto>> Handle(GetCompetitionQuestionsQuery request, CancellationToken cancellationToken)
    {
        var questions = await _repository.GetRandomQuestionsAsync(request.CompetitionId);
        var result = questions.Select(q =>
        {
            var optionsDictionary = JsonSerializer.Deserialize<Dictionary<string, string>>(q.OptionsJson);

            return new QuizQuestionDto
            {
                QuestionId = q.Id,
                QuestionText = q.QuestionText,
                Options = optionsDictionary.Select(o => new OptionDto
                {
                    Key = o.Key,
                    Text = o.Value
                }).ToList(),
                CorrectAnswer = q.CorrectAnswer
            };
        }).ToList();

        return result;
    }
}
