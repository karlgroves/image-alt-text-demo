# READ ME

This is just a quick & dirty proof of concept to test out the use of [OpenAI's API](https://platform.openai.com/docs/guides/vision) for generating alternate text for images.

As a general rule, I don't believe in using AI-generated alt text for images, but I do think it can be useful for suggesting alternate text. It is likely that [Eventably](https://eventably.com) will use alt-text suggestions to help organizers create more inclusive content when creating events.

## How to use

Run `npm install` to install the dependencies.

[Grab your API key from OpenAI](https://platform.openai.com/settings/organization/api-keys).

Create a `.env` file using the sample in `backend/.envSAMPLE` and add your API key.

CD into the `backend` folder and run `node index.js` to start the server.

CD into the `frontend` folder and run `npm start` to start the frontend.

The frontend will be available at `localhost:3000`. From there, you can upload an image and see the alt text suggestions.
