const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

async function scoreLead(leadData) {
  try {
    const prompt = `
Given the following lead details, assign a score from 1 to 100 indicating how likely this lead is to convert into a customer. Consider fields like budget, location, use-case, and vehicle type:

${JSON.stringify(leadData, null, 2)}

Reply with only the score (number only).
`;

    const response = await cohere.generate({
      model: "command",
      prompt,
      max_tokens: 10,
    });

    const output = response.generations[0].text.trim();
    const score = parseInt(output.match(/\d+/)?.[0], 10) || 0;

    return score;
  } catch (err) {
    console.error("Cohere scoring error:", err.message);
    return 0; // Fallback score
  }
}

module.exports = scoreLead;