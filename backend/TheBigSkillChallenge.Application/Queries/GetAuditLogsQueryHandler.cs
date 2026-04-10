using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TheBigSkillChallenge.Application.DTOs;
using TheBigSkillChallenge.Application.Interfaces;

namespace TheBigSkillChallenge.Application.Queries
{
    public class GetAuditLogsQueryHandler : IRequestHandler<GetAuditLogsQuery, IEnumerable<AuditLogDto>>
    {
        private readonly IAuditLogRepository _repository;

        public GetAuditLogsQueryHandler(IAuditLogRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<AuditLogDto>> Handle(GetAuditLogsQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetAuditLogsAsync();
        }
    }
}
