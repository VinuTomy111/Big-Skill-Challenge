using MediatR;
using System.Collections.Generic;
using TheBigSkillChallenge.Application.DTOs;

namespace TheBigSkillChallenge.Application.Queries
{
    public class GetAuditLogsQuery : IRequest<IEnumerable<AuditLogDto>>
    {
    }
}
