# backend/llm.py
from openai import AzureOpenAI
from dotenv import load_dotenv
import os
import tiktoken

load_dotenv()
# print("TOP OF LLM.PY")

class AzureOpenAILLM:
    def __init__(self, input_api_key, model_name):
        self.model = model_name
        self.model_params = self.get_model_params(self.model)
        self.client = AzureOpenAI(
            api_key=input_api_key,
            azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
            api_version=self.model_params["api_version"]
        )
        self.encoding = tiktoken.get_encoding(self.model_params["encoding_name"])

    def get_model_params(self, model):
        if model == "arcadisgpt-gpt35-0125":
            return {
                "api_version": "2023-05-15",
                "encoding_name": "cl100k_base"
            }
        elif model == "gpt-4o":
            return {
                "api_version": "2024-06-01",
                "encoding_name": "o200k_base"
            }
        else:
            raise ValueError(f"Model name {model} is not supported.")

    def chat_completion(
            self,
            prompt,
            max_tokens=1024,
            temperature=0.2,
            system="You are an OpenAI chatbot. Use professional, clear replies.",
            get_tokens:bool=False
    ):
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=temperature
            )
            if get_tokens:
                self.get_prompt_tokens(system, prompt)
        except Exception as e:
            print(f"OpenAI error: {e}\nInput: {prompt}")
            return ""
        return response.choices[0].message.content

    def validate_api_key(self):
        try:
            test_prompt = "Hello, world!"
            response = self.chat_completion(test_prompt)
            if response:
                return True, "API key is valid and working."
        except Exception as e:
            if "authentication" in str(e).lower():
                return False, "Invalid API key, please try again."
            else:
                return False, "Failed to connect to OpenAI. Please check your internet connection and try again."
        return False, "Invalid API key, please try again."

    def get_prompt_tokens(self, system:str, prompt:str):
        text = system + prompt
        tokens = self.encoding.encode(text)
        tokens_number = len(tokens)
        tokens_number += 6 # 3 per message
        print(f"Number of tokens for: '{text[:300]}[...]' is: {tokens_number}")
        return tokens
