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
  const departureCountry = req.body.departureCountry;
  // const destinationAirport = req.body.destinationAirport;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  // const prompt = `Recommend activities in ${destinationAirport}, ${destinationCountry} from ${startDate} to ${endDate}`;

  const prompt = `I will give you a ${destinationCountry} (defined as destination country), ${departureCountry} (defined as departure country), ${startDate} (defined as start date), ${endDate} (defined as end date). 
                  "City" is the city of the departure country. Use the defined variables and definitions to fill in the same variable in the format below. 
                  "Day #" should be the number of days suggested at each itinerary destination. Return an itinerary in the format defined below.
                  
                  From this point forward a person who is a young adult in between the ages of 18 and 25 will be entering information that define 
                  the destination country, departure country, start date, and date. The city will be suggested.
                  
                  destinationCountry = 'Spain'
                  departureCountry = 'USA'
                  startDate = '3/20/2023'
                  endDate = '6/20/2023'

                  I want to travel. I want to go to the destinationCountry, I am flying from the departureCountry, 
                  I want to start this trip on the startDate, and I want to be back in the departureCountry on the endDate. 
                  Make an itinerary for me.

                  *Start Format*

                  Day #: City, destinationCountry Date Range
                  Active Activities: {Physical activities that the model recommends}
                  Social Activities: {Social activities that the model recommends}

                  Day #: City, destinationCountry Date Range
                  Active Activities: {Physical activities that the model recommends}
                  Social Activities: {Social activities that the model recommends}
                  
                  Day #: City, destinationCountry Date Range
                  Active Activities: {Physical activities that the model recommends}
                  Social Activities: {Social activities that the model recommends}

                  *END FORMAT*

                  The itinerary should take the total number of days available, 
                  allocate days based on general travel guides (make any assumptions necessary where there is no information), 
                  and take into account travel time between the itinerary destinations. Make all assumptions necessary.
              
                `

  // Call the GPT-3 model with the prompt
  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }


    if (!destinationCountry || !departureCountry || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: "Please provide all information",
      });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const completion = response.data.choices[0].message.content;
    console.log("Generated text:", completion);

    // const message = `${destinationAirport}, ${destinationCountry} from ${startDate} to ${endDate}`;
    // console.log("Generated message:", message);

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


