# Reverse Turing Test

Originally made by a lovable template and then modified a lot.

## Development

You need to get a [together.ai API key](https://api.together.ai/settings/api-keys),
[Gemini API Key](https://aistudio.google.com/apikey),
[OpenAI api key](https://platform.openai.com/settings/organization/api-keys),
and a setup and [cockroachdb cluster](https://www.cockroachlabs.com/docs/cockroachcloud/quickstart#create-a-free-trial-cluster)
add them to a .env file.

```
TOGETHER_API_KEY=
GEMINI_API_KEY=
OPENAI_API_KEY=
DATABASE_URL="postgresql://"
```

Then you can setup the prisma database (this does delete your previous DB)

```
npm i
npx prisma db push --force-reset --accept-data-loss
```

Then you can start the app

```
npm run dev
```
