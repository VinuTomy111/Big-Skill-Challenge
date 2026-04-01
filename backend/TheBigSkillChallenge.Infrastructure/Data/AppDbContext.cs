using Microsoft.EntityFrameworkCore;
using TheBigSkillChallenge.Domain.Entities;

namespace TheBigSkillChallenge.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Competition> Competitions => Set<Competition>();
    public DbSet<Entry> Entries => Set<Entry>();
    public DbSet<QuizQuestion> QuizQuestions => Set<QuizQuestion>();
    public DbSet<CompetitionQuestion> CompetitionQuestions => Set<CompetitionQuestion>();
    public DbSet<EmailVerificationOTP> EmailVerificationOTPs => Set<EmailVerificationOTP>();
    public DbSet<AIValidationResult> AIValidationResults => Set<AIValidationResult>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<QuizSession> QuizSessions => Set<QuizSession>();
    public DbSet<QuizAnswer> QuizAnswers => Set<QuizAnswer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CompetitionQuestion>()
            .HasKey(cq => new { cq.CompetitionId, cq.QuizQuestionId });
            
        modelBuilder.Entity<Entry>()
            .HasOne(e => e.ValidationResult)
            .WithOne(v => v.Entry)
            .HasForeignKey<AIValidationResult>(v => v.EntryId);
    }
}
