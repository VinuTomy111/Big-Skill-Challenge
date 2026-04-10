using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TheBigSkillChallenge.Application.DTOs;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Infrastructure.Data;

namespace TheBigSkillChallenge.Infrastructure.Repositories
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly AppDbContext _context;

        public AuditLogRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AuditLogDto>> GetAuditLogsAsync()
        {
            var query = from log in _context.AuditLogs
                        join user in _context.Users
                        on log.UserId equals user.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        orderby log.Timestamp descending
                        select new AuditLogDto
                        {
                            Id = log.Id,
                            Action = log.Action,
                            Subsystem = log.Subsystem,
                            Details = log.Details,
                            UserEmail = user != null ? user.Email : null,
                            CreatedDate = log.Timestamp
                        };

            return await query.ToListAsync();
        }
    }
}
