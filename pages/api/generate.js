export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { cv, jobDesc } = req.body || {};
  if (!cv || !jobDesc) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const callClaude = async (system, user) => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: user }]
      })
    });
    const data = await response.json();
    return data.content[0].text;
  };
  try {
    const [tailoredCV, coverLetter] = await Promise.all([
      callClaude("You are an expert CV writer. Rewrite the CV to match the job description. Return only the rewritten CV.", `CV:\n${cv}\n\nJOB:\n${jobDesc}`),
      callClaude("You are an expert cover letter writer. Write a 3 paragraph cover letter. No boring openers. Return only the cover letter.", `CV:\n${cv}\n\nJOB:\n${jobDesc}`)
    ]);
    return res.status(200).json({ tailoredCV, coverLetter });
  } catch (error) {
    return res.status(500).json({ error: "Generation failed" });
  }
}
