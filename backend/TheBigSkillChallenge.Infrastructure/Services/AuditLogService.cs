using System;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Domain.Entities;
using TheBigSkillChallenge.Infrastructure.Data;

namespace TheBigSkillChallenge.Infrastructure.Services
{
    public class AuditLogService : IAuditLogService
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuditLogService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task LogAsync(string action, string subsystem, string detail, Guid? userId = null)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var ipAddress = httpContext?.Connection?.RemoteIpAddress?.ToString();
            var requestId = httpContext?.TraceIdentifier;
            
            // Try to extract CorrelationId from headers, if not available, use TraceIdentifier
            var correlationId = httpContext?.Request?.Headers["X-Correlation-ID"].FirstOrDefault() ?? requestId;

            var auditLog = new AuditLog
            {
                UserId = userId,
                Action = action,
                Subsystem = subsystem,
                Details = detail,
                IpAddress = ipAddress,
                RequestId = requestId,
                CorrelationId = correlationId,
                Timestamp = DateTime.UtcNow
            };

            await _context.AuditLogs.AddAsync(auditLog);
            await _context.SaveChangesAsync();
        }
    }
}
