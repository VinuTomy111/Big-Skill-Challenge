using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TheBigSkillChallenge.Application.Commands.Submissions;
using TheBigSkillChallenge.Application.DTOs;

namespace TheBigSkillChallenge.API.Controllers;

[ApiController]
[Route("api/v1/submissions")]
[Authorize]
public class CreativeSubmissionController : ControllerBase
{
    private readonly IMediator _mediator;

    public CreativeSubmissionController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<CreativeSubmissionResponseDto>> Submit([FromBody] CreativeSubmissionRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized("User ID claim not found.");

        try
        {
            var command = new SubmitCreativeSubmissionCommand(userId, request.QuizSessionId, request.Text);
            var response = await _mediator.Send(command);
            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }
}

public class CreativeSubmissionRequest
{
    public Guid QuizSessionId { get; set; }
    public string Text { get; set; } = string.Empty;
}
