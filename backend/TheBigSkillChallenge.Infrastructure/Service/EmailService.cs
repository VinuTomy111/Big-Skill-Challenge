using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using TheBigSkillChallenge.Application.Interfaces;
using TheBigSkillChallenge.Infrastructure.Configuration;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendOtpEmail(string email, string otp)
    {
        using var smtpClient = new SmtpClient(_emailSettings.Host, _emailSettings.Port)
        {
            Credentials = new NetworkCredential(
                _emailSettings.Username,
                _emailSettings.Password),
            EnableSsl = true
        };

        var mail = new MailMessage
        {
            From = new MailAddress(_emailSettings.FromEmail),
            Subject = "Your OTP Code",
            Body = $"Your verification OTP is: {otp}",
            IsBodyHtml = false
        };

        mail.To.Add(email);

        await smtpClient.SendMailAsync(mail);
    }
}