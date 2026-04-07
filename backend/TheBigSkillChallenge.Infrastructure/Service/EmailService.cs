using System.Net;
using System.Net.Http;
using System.Net.Mail;
using TheBigSkillChallenge.Application.Interfaces;

public class EmailService : IEmailService
{
    public async Task SendOtpEmail(string email, string otp)
    {
        using var smtpClient = new SmtpClient("sandbox.smtp.mailtrap.io", 2525)
        {
            Credentials = new NetworkCredential("f1655166985a53", "59ee00c8b020c3"),
            EnableSsl = true
        };

        var mail = new MailMessage
        {
            From = new MailAddress("noreply@bigskill.com"),
            Subject = "Your OTP Code",
            Body = $"Your verification OTP is: {otp}",
            IsBodyHtml = false
        };

        mail.To.Add(email);

        await smtpClient.SendMailAsync(mail);
    }
}