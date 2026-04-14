using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TheBigSkillChallenge.Application.DTOs;

namespace TheBigSkillChallenge.Application.Interfaces
{
    public interface IAuditLogRepository
    {
        Task<IEnumerable<AuditLogDto>> GetAllAuditLogsAsync();
        Task<IEnumerable<AuditLogDto>> GetAuditLogsByUserIdAsync(Guid userId);
    }
}
