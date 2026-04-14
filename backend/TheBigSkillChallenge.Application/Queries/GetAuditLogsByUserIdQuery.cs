using System;
using MediatR;
using System.Collections.Generic;
using TheBigSkillChallenge.Application.DTOs;

namespace TheBigSkillChallenge.Application.Queries
{
    public class GetAuditLogsByUserIdQuery : IRequest<IEnumerable<AuditLogDto>>
    {
        public Guid UserId { get; set; }
    }
}
