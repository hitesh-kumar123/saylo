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
        # Legacy method kept for fallback
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
        # Legacy method kept for fallback
        # Returns simple string in legacy flow, but strictly we need parsed JSON in v2
        pass

    # --- New Adaptive Methods (V2) ---

    async def evaluate_answer_v2(self, role, difficulty, stage, q_count, weak_areas, strong_areas, question, answer) -> dict:
        import json
        
        system_prompt = f"""You are evaluating a user's interview answer.

INPUT:
- Role: {role}
- Current Difficulty: {difficulty}
- Current Stage: {stage}
- Question Count: {q_count}
- Weak Areas: {weak_areas}
- Strong Areas: {strong_areas}
- Question: {question}
- User Answer: {answer}

TASK:
1. Score the answer from 1 to 10.
2. Mark the answer as Strong or Weak.
3. Identify ONE critical mistake if any.
4. Decide difficulty trend: upgrade | downgrade | stable.
5. Decide next action: Drill down on same topic | Move to new topic.
6. Decide if interview stage should change.
7. Decide if interview should end.

OUTPUT (JSON ONLY):
{{
  "score": number,
  "classification": "strong | weak",
  "critical_mistake": "string | null",
  "difficulty_trend": "upgrade | downgrade | stable",
  "next_focus": "string",
  "stage_change": "technical_deep_dive | soft_skills | closing | null",
  "end_interview": true | false
}}"""

        prompt = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\nGenerate the JSON evaluation.<|eot_id|><|start_header_id|>assistant<|end_header_id|>"
        
        response_text = self.generate_response(prompt)
        
        # Simple/Naive JSON extraction
        try:
            start_index = response_text.find('{')
            end_index = response_text.rfind('}')
            if start_index != -1 and end_index != -1:
                json_str = response_text[start_index:end_index+1]
                return json.loads(json_str)
            else:
                print(f"Failed to extract JSON from LLM response: {response_text}")
                return {
                    "score": 5, 
                    "classification": "weak", 
                    "next_focus": "Move to new topic", 
                    "feedback": "Could not parse AI evaluation."
                }
        except Exception as e:
            print(f"JSON Parsing Error: {e}")
            return {"score": 5, "next_focus": "Move to new topic", "error": "Parsing Error"}

    async def generate_question_v2(self, role, difficulty, stage, weak_areas, strong_areas, directive) -> str:
        system_prompt = f"""You are a human-like technical interviewer.

INPUT:
- Role: {role}
- Difficulty: {difficulty}
- Stage: {stage}
- Weak Areas: {weak_areas}
- Strong Areas: {strong_areas}
- Directive: {directive}

RULES:
- Ask ONE question only.
- If directive says "Drill down", ask a follow-up.
- If "Move on", ask a new topic question.
- Match depth to difficulty and stage.

OUTPUT:
Next interview question (plain text only)."""

        prompt = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\nAsk the question.<|eot_id|><|start_header_id|>assistant<|end_header_id|>"
        
        return self.generate_response(prompt).strip()

    async def generate_final_feedback(self, role, difficulty_history, question_count, strong_areas, weak_areas, recent_critical_mistakes, average_score, non_verbal_stats=None) -> dict:
        import json
        system_prompt = f"""You are a senior technical interviewer giving final feedback.

INPUT DATA:
- Role: {role}
- Interview Difficulty Range: {difficulty_history}
- Total Questions Asked: {question_count}

PERFORMANCE SUMMARY:
- Strong Areas: {strong_areas}
- Weak Areas: {weak_areas}
- Critical Mistakes: {recent_critical_mistakes}
- Average Score: {average_score}

NON-VERBAL BEHAVIOR:
{non_verbal_stats if non_verbal_stats else 'No webcam data available.'}

TASK:
1. Give an overall interview score (1–10).
2. List top 2–3 strengths.
3. List 2–3 areas for improvement (technical and behavioral). If non-verbal behavior suggested nervousness (low eye contact, high movement), mention it gently.
3. List top 2–3 weaknesses.
4. Comment on difficulty trend (improved / stable / declined).
5. Give 2–3 actionable improvement tips.
6. Give a final verdict about readiness for the role.

OUTPUT (JSON ONLY):
{{
  "overall_score": number,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "difficulty_trend": "improved | stable | declined",
  "improvement_tips": ["...", "..."],
  "final_verdict": "string"
}}"""

        prompt = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\nGenerate the final feedback JSON.<|eot_id|><|start_header_id|>assistant<|end_header_id|>"
        
        response_text = self.generate_response(prompt)
        
        # Simple/Naive JSON extraction
        try:
            start_index = response_text.find('{')
            end_index = response_text.rfind('}')
            if start_index != -1 and end_index != -1:
                json_str = response_text[start_index:end_index+1]
                return json.loads(json_str)
            else:
                print(f"Failed to extract JSON from LLM response: {response_text}")
                return {
                    "overall_score": average_score, 
                    "strengths": strong_areas, 
                    "weaknesses": weak_areas,
                    "final_verdict": "Could not generate detailed feedback."
                }
        except Exception as e:
            print(f"JSON Parsing Error: {e}")
            return {"final_verdict": "Error generating feedback"}

llm_service = LLMService()
