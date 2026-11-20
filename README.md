# AI Job Match Assistant

A small web app that analyzes a job description and returns a role summary, the key skills the role emphasizes, and interview prep questions. Built with React, TypeScript, Node.js on AWS Lambda, and Amazon Bedrock (Claude).

This is a build in public project. It is a work in progress, and the status section below says exactly what works today.

## Status

| Piece | State |
|-------|-------|
| React + TypeScript front end (form, character counter, result card) | Working |
| Node.js Lambda handler with input validation | Working |
| Local dev server for the handler | Working |
| Amazon Bedrock call (Claude via the Converse API) | Written, not yet verified end to end. My AWS account is waiting on Bedrock access from AWS Support. |
| Mock mode (returns sample output, no AI call) | Working |
| Retrieval over my own experience notes | Planned |
| Structured output (match score, gaps, tailored bullets) | Planned |
| Prompt injection guardrails and least privilege IAM | Planned |
| Deployment (Lambda, API Gateway, static hosting) | Planned |

## How it works

```
React form  ->  /api/analyze  ->  Lambda handler  ->  Amazon Bedrock (Claude)
                                     |
                      validates input, caps output,
                      wraps the job description as untrusted data
```

## Cost and safety choices

- Input is limited to 6,000 characters and output to 800 tokens
- The job description is wrapped in tags and the system prompt tells the model to treat it as data, not instructions
- No managed vector database, to avoid idle monthly charges
- Secrets stay out of the repo (`.env` is git ignored)
- Mock mode lets the whole app run with no AWS charges

## Getting started

### Prerequisites

- Node.js 20 or newer
- An AWS account with Amazon Bedrock access to a Claude model (skip this if you only use mock mode)
- AWS credentials configured locally with `aws configure` (skip this if you only use mock mode)

### 1. Configure the backend

Create `backend/.env` with:

```
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=us.anthropic.claude-haiku-4-5-20251001-v1:0
PORT=3001
MOCK_AI=true
```

Set `MOCK_AI=true` to get sample output with no AI call. Remove that line (or set it to `false`) to call Bedrock for real.

### 2. Run the backend

```
cd backend
npm install
npm run dev
```

### 3. Run the front end

In a second terminal:

```
cd frontend
npm install
npm run dev
```

Open the link it prints, usually `http://localhost:5173`.

## Project structure

```
backend/
  src/handler.ts   Lambda handler: validation, Bedrock call, mock mode
  src/local.ts     Local HTTP server that runs the handler
frontend/
  src/App.tsx      Form, character counter, result card
```

## Tech stack

React, TypeScript, Vite, Node.js, AWS Lambda, Amazon Bedrock

## Author

Sulieman Danon. Full stack engineer holding AWS Certified Generative AI Developer Professional and Claude Certified Architect Foundations.