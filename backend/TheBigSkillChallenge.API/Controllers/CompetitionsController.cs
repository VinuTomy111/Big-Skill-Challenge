using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheBigSkillChallenge.Application.Queries;

namespace TheBigSkillChallenge.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class CompetitionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public CompetitionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("competitions")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllCompetitionsQuery());
        return Ok(result);
    }

    [HttpGet("{competitionId}/questions")]
    public async Task<IActionResult> GetQuestions(Guid competitionId)
    {
        var query = new GetCompetitionQuestionsQuery { CompetitionId = competitionId };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("/api/v1/competition/session-timeout")]
    public async Task<IActionResult> SessionTimeout([FromBody] TheBigSkillChallenge.Application.Commands.Quiz.SessionTimeoutCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
