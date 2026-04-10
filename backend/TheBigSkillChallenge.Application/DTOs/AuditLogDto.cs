using System;

namespace TheBigSkillChallenge.Application.DTOs
{
    public class AuditLogDto
    {
        public Guid Id { get; set; }
        public string Action { get; set; } = string.Empty;
        public string Subsystem { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public string? UserEmail { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
