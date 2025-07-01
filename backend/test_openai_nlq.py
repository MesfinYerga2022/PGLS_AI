"""
Test  Azure OpenAI API Key and deployment for Natural Language Data Q&A.
It can be use this to debug connectivity and verify the backend setup.
"""
import os
import json
from llm import AzureOpenAILLM
import pandas as pd

def main():
    # 1. Load API key and deployment name from environment variables or prompt user
    api_key = os.environ.get('AZURE_OPENAI_KEY')
    deployment = os.environ.get('AZURE_OPENAI_DEPLOYMENT')  # Use the real deployment name

    assert api_key, "AZURE_OPENAI_KEY is not set in environment variables!"
    assert deployment, "AZURE_OPENAI_DEPLOYMENT is not set in environment variables!"

    # 2. Create AzureOpenAILLM instance
    llm = AzureOpenAILLM(api_key, deployment)

    # 3. Validate API key
    is_valid, message = llm.validate_api_key()
    print(f"[KEY TEST] {message}")
    if not is_valid:
        return

    # 4. (Optional) Test DataFrame loading
    try:
        # You can use any CSV file to simulate the data
        df = pd.read_csv("src/the_data.csv")  # Change to the test file
    except Exception as e:
        print(f"[DATA TEST] Failed to load CSV: {e}")
        # Simulate some data if no CSV present
        df = pd.DataFrame({
            "country": ["Netherlands", "Germany"],
            "city": ["Amsterdam", "Berlin"],
            "value": [100, 200]
        })

    print("[DATA PREVIEW]")
    print(df.head())

    # 5. Format for prompt: Use the data Q&A structure (simulate as in the app)
    columns = list(df.columns)
    data = df.values.tolist()
    data_sample = [columns] + data[:20]  # Limit sample size for token cost

    # Compose question and system prompt for Data Q&A (mimic the real app)
    user_question = "What is the average value per country?"
    system_prompt = (
        "You are a data expert. Answer questions about the following table as simply and clearly as possible. "
        "If calculations are needed, show them step by step. Only use the data given. "
        "Table format is: columns in the first row, then data rows."
    )

    # Show token usage for info/debug
    llm.get_prompt_tokens(system_prompt, user_question)

    # 6. Call the model
    prompt = f"Table: {json.dumps(data_sample)}. Question: {user_question}"

    try:
        response = llm.chat_completion(
            prompt,
            max_tokens=512,
            temperature=0.2,
            system=system_prompt
        )
        print("\n[MODEL RESPONSE]")
        print(response)
    except Exception as e:
        print(f"[OPENAI ERROR] {e}")

if __name__ == "__main__":
    main()
