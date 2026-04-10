using System;
using System.Threading.Tasks;

namespace TheBigSkillChallenge.Application.Interfaces
{
    public interface IAuditLogService
    {
        Task LogAsync(string action, string subsystem, string detail, Guid? userId = null);
    }
}
