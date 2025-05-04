# Reverse Turing Test

Originally made by a lovable template and then modified a lot.

## Development

You need to get a [together.ai API key](https://api.together.ai/settings/api-keys),
[Gemini API Key](https://aistudio.google.com/apikey),
[OpenAI api key](https://platform.openai.com/settings/organization/api-keys).

Then setup a [cockroachdb cluster](https://www.cockroachlabs.com/docs/cockroachcloud/quickstart#create-a-free-trial-cluster). Get the database URL with the password.

Add all necessary keys to a .env file in the root of the project.

```
TOGETHER_API_KEY=
GEMINI_API_KEY=
OPENAI_API_KEY=
DATABASE_URL="postgresql://"
```

Then you can setup the prisma database (this does delete your previous DB)

```bash
npm i
npx prisma db push --force-reset --accept-data-loss
```

Then you can start the app

```bash
npm run dev
```
