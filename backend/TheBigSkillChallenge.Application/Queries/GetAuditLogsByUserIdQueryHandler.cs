using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TheBigSkillChallenge.Application.DTOs;
using TheBigSkillChallenge.Application.Interfaces;

namespace TheBigSkillChallenge.Application.Queries
{
    public class GetAuditLogsByUserIdQueryHandler : IRequestHandler<GetAuditLogsByUserIdQuery, IEnumerable<AuditLogDto>>
    {
        private readonly IAuditLogRepository _repository;

        public GetAuditLogsByUserIdQueryHandler(IAuditLogRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<AuditLogDto>> Handle(GetAuditLogsByUserIdQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetAuditLogsByUserIdAsync(request.UserId);
        }
    }
}
