namespace TheBigSkillChallenge.Domain.Entities;

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Subsystem { get; set; } = string.Empty; // e.g., "AI_Validation", "Auth"
    public string Details { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
    public string? RequestId { get; set; }
    public string? CorrelationId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
