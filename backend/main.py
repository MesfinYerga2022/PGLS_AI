import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from llm import AzureOpenAILLM

# print("TOP OF MAIN.PY")
load_dotenv()
# print("Loaded .env variables!")

AZURE_OPENAI_KEY = os.environ.get("AZURE_OPENAI_KEY")
AZURE_OPENAI_DEPLOYMENT = os.environ.get("AZURE_OPENAI_DEPLOYMENT")

# Health-check: If not found, crash early (except in CI/test environments)
CI_ENVIRONMENT = os.environ.get("CI") or os.environ.get("GITHUB_ACTIONS")
if not CI_ENVIRONMENT:
    assert AZURE_OPENAI_KEY, "AZURE_OPENAI_KEY not set"
    assert AZURE_OPENAI_DEPLOYMENT, "AZURE_OPENAI_DEPLOYMENT not set"
else:
    # In CI environment, use dummy values for testing
    AZURE_OPENAI_KEY = AZURE_OPENAI_KEY or "dummy-key-for-ci"
    AZURE_OPENAI_DEPLOYMENT = AZURE_OPENAI_DEPLOYMENT or "gpt-4o"

# print(f"KEY LOADED: {AZURE_OPENAI_KEY[:4]}... DEPLOYMENT: {AZURE_OPENAI_DEPLOYMENT}")

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to the frontend URL in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health-check endpoint
@app.get("/ping")
async def ping():
    return {"ping": "pong"}

# Minimal echo endpoint for basic POST testing
@app.post("/api/echo")
async def echo(request: Request):
    print("=== /api/echo CALLED ===")
    raw = await request.body()
    print("RAW BODY:", raw)
    try:
        data = await request.json()
        print("ECHO DATA:", data)
    except Exception as e:
        print("JSON PARSE ERROR:", e)
        return JSONResponse(status_code=400, content={"error": f"JSON parse error: {e}"})
    return {"you_sent": data}

# Main OpenAI proxy route with deep debugging
@app.post("/api/openai/chat")
async def chat_openai(request: Request):
    try:
        print("=== /api/openai/chat CALLED ===")
        print("Headers:", request.headers)
        raw_body = await request.body()
        print("RAW BODY:", raw_body)
        try:
            data = await request.json()
        except Exception as e:
            print("JSON PARSE ERROR:", e)
            return JSONResponse(status_code=400, content={"error": f"JSON parse error: {e}"})
        print("DATA:", data)
        messages = data.get("messages")
        print("MESSAGES:", messages)
        max_tokens = data.get("max_tokens", 1024)
        temperature = data.get("temperature", 0.2)
        model = data.get("model", AZURE_OPENAI_DEPLOYMENT)

        if not messages or not isinstance(messages, list):
            print("ERROR: No messages provided")
            return JSONResponse(status_code=400, content={"error": "No messages provided"})

        system_msg = next((m['content'] for m in messages if m['role'] == 'system'), "You are a helpful assistant.")
        user_msg = next((m['content'] for m in messages if m['role'] == 'user'), "")

        print("System:", system_msg)
        print("User:", user_msg)

        llm = AzureOpenAILLM(AZURE_OPENAI_KEY, model)
        response = llm.chat_completion(
            prompt=user_msg,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_msg
        )
        print("LLM Response:", response)
        return {"choices": [{"message": {"content": response}}]}
    except Exception as e:
        print("OpenAI Proxy error:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})
