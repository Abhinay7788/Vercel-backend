const { CohereClient } = require("cohere-ai");
const cohere = new CohereClient({ apiKey: process.env.COHERE_API_KEY });

exports.getSuggestions = async (req, res) => {
  const {
    type = "bus",
    schoolName,
    strength,
    location,
    businessName,
    goodsType,
  } = req.body;

  try {
    let prompt = "";

    if (type === "bus") {
      prompt = `Suggest the best route, ideal seat count, and most suitable Ashok Leyland model for a school named "${schoolName}" located at (${location.latitude}, ${location.longitude}) with ${strength} students. Respond in this format:

Route: [Route Name]
Seats: [Seat Count]
Model: [Model Name]`;
    } else {
      prompt = `Suggest the best Ashok Leyland truck model and ideal configuration for a logistics business named "${businessName}" transporting "${goodsType}". Respond in this format:

Route: [Optional Route]
Seats: [Cab Capacity or N/A]
Model: [Truck Model Name]`;
    }

    const response = await cohere.generate({
      model: "command-r",
      prompt,
      maxTokens: 100,
      temperature: 0.5,
    });

    const text = response.generations[0]?.text || "";

    // 🧠 Basic extraction from structured response
    const routeMatch = text.match(/Route:\s*(.+)/i);
    const seatsMatch = text.match(/Seats:\s*(.+)/i);
    const modelMatch = text.match(/Model:\s*(.+)/i);

    return res.json({
      route: routeMatch?.[1]?.trim() || "",
      seats: seatsMatch?.[1]?.trim() || "",
      model: modelMatch?.[1]?.trim() || "",
      raw: text,
    });
  } catch (err) {
    console.error("LLM Error:", err.message);
    res.status(500).json({ error: "LLM suggestion failed" });
  }
};