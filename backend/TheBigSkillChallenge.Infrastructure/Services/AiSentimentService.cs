using System.Net.Http.Json;
using TheBigSkillChallenge.Application.Interfaces;

namespace TheBigSkillChallenge.Infrastructure.Services;

public class AiSentimentService : IAiSentimentService
{
    private readonly HttpClient _httpClient;

    public AiSentimentService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<double> GetSentimentScoreAsync(string text)
    {
        var payload = new { text = text };
        var response = await _httpClient.PostAsJsonAsync("/api/v1/sentiment-score", payload);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"AI Service returned {response.StatusCode}");
        }

        var result = await response.Content.ReadFromJsonAsync<SentimentResponse>();
        return result?.Score ?? 0;
    }

    private class SentimentResponse
    {
        public double Score { get; set; }
    }
}
