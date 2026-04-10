using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TheBigSkillChallenge.Application.Queries;

namespace TheBigSkillChallenge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AuditLogsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuditLogsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAuditLogs()
        {
            var query = new GetAuditLogsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
