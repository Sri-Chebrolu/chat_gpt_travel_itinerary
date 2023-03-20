require("dotenv").config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const port = process.env.PORT || 5000;

app.post("/ask", async (req, res) => {
  // const prompt = req.body.prompt;
  
  const destinationCountry = req.body.destinationCountry;
  const departureAirport = req.body.departureAirport;
  const destinationAirport = req.body.destinationAirport;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const prompt = `Recommend activities in ${destinationAirport}, ${destinationCountry} from ${startDate} to ${endDate}`;

  // Call the GPT-3 model with the prompt
  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    const completion = response.data.choices[0].message.content;
    console.log("Generated text:", completion);
    return res.status(200).json({
      success: true,
      message: completion
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}!!`));