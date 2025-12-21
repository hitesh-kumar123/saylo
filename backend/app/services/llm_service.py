from llama_cpp import Llama
from app.core.config import settings
import os

class LLMService:
    def __init__(self):
        self.model_path = os.path.join(os.getcwd(), "models", "Llama-3.2-3B-Instruct-Q4_K_M.gguf")
        self.llm = None

    def load_model(self):
        if not self.llm:
            try:
                print(f"Loading Model from: {self.model_path}")
                # n_ctx=2048 default, n_gpu_layers=0 for CPU (safe start)
                # verbose=True helps debug
                self.llm = Llama(
                    model_path=self.model_path,
                    n_ctx=2048,
                    n_gpu_layers=0, 
                    verbose=True 
                )
                print("Model Loaded Successfully!")
            except Exception as e:
                print(f"Failed to load model: {e}")
                print("Make sure the .gguf file is in backend/models/")

    def generate_response(self, prompt: str) -> str:
        if not self.llm:
            self.load_model()
        
        if not self.llm:
            return "Model not loaded. Please check server logs."

        # Llama-cpp generation
        output = self.llm(
            prompt, 
            max_tokens=256, 
            stop=["<|eot_id|>", "Question:", "Answer:"], 
            temperature=0.7,
            echo=False
        )
        return output["choices"][0]["text"]

    async def generate_question(self, role: str, difficulty: str, topic: str, previous_questions: list) -> str:
        prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a professional technical interviewer looking to hire a {role}.
Generate a single {difficulty} difficulty interview question about {topic}.
Rules:
1. Ask ONLY the question. No greetings.
2. Keep it concise.
3. Do not repeat: {previous_questions}<|eot_id|><|start_header_id|>user<|end_header_id|>

Generate the question.<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""
        
        return self.generate_response(prompt)

    async def evaluate_answer(self, question: str, answer: str) -> dict:
        prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Evaluate the answer. Return ONLY a JSON string with keys: 'score' (1-10), 'feedback', 'strengths', 'weaknesses'.<|eot_id|><|start_header_id|>user<|end_header_id|>

Question: {question}
Answer: {answer}<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""
        
        return self.generate_response(prompt)

llm_service = LLMService()
