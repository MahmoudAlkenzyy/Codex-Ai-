import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

//get start with configrathion
dotenv.config({ path: 'config.env' });

console.log(`'${process.env.OPENAI_API_KEY}'`);
const configuration = new Configuration({
    apiKey: `${process.env.OPENAI_API_KEY}`,
});

//create instance openAi
const openai = new OpenAIApi(configuration);

// intialize our express application
const app = express();
//satup middlewares

//allow make origin requests and  server be called from frontEnd
app.use(cors());

// allow to pass json from frontend => backend
app.use(express.json());

// create root route
app.get('/', async (req, res) => {
    res.status(200).send({ message: 'Hello from Codex' });
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});
app.listen(5000, () =>
    console.log('AI server started on http://localhost:5000')
);
