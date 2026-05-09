import json
import logging
from google import genai
from google.genai import types
from app.core.config import settings

logger = logging.getLogger(__name__)

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client

MODEL = "gemini-2.0-flash"


class LLMService:

    def generate_response(self, prompt: str) -> str:
        try:
            client = _get_client()
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.7),
            )
            return response.text
        except Exception as e:
            logger.error("Failed to generate response: %s", e)
            return "Model generation failed. Please check server logs."

    def _generate_json(self, prompt: str) -> str:
        try:
            client = _get_client()
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.5,
                    response_mime_type="application/json",
                ),
            )
            return response.text
        except Exception as e:
            logger.error("Failed to generate JSON response: %s", e)
            return "{}"

    def _extract_json(self, response_text: str, fallback: dict) -> dict:
        try:
            start = response_text.find("{")
            end = response_text.rfind("}")
            if start != -1 and end != -1:
                return json.loads(response_text[start:end + 1])
            return fallback
        except Exception as e:
            logger.error("JSON Parsing Error: %s", e)
            return fallback

    async def generate_question(
        self, role: str, difficulty: str, topic: str, previous_questions: list
    ) -> str:
        prompt = f"""You are a professional technical interviewer hiring a {role}.
Generate a single {difficulty} difficulty interview question about {topic}.
Rules:
1. Ask ONLY the question. No greetings or preamble.
2. Keep it concise and clear.
3. Do not repeat: {previous_questions}"""
        return self.generate_response(prompt)

    async def evaluate_answer_v2(
        self, role, difficulty, stage, q_count, weak_areas, strong_areas, question, answer
    ) -> dict:
        prompt = f"""You are evaluating a user's interview answer.

INPUT:
- Role: {role}
- Current Difficulty: {difficulty}
- Current Stage: {stage}
- Question Count: {q_count}
- Weak Areas: {weak_areas}
- Strong Areas: {strong_areas}
- Question: {question}
- User Answer: {answer}

TASK: Evaluate the answer and return JSON only.

OUTPUT JSON:
{{
  "score": <number 1-10>,
  "classification": "<strong|weak>",
  "critical_mistake": "<string or null>",
  "difficulty_trend": "<upgrade|downgrade|stable>",
  "next_focus": "<string>",
  "stage_change": "<technical_deep_dive|soft_skills|closing|null>",
  "end_interview": <true|false>
}}"""
        text = self._generate_json(prompt)
        return self._extract_json(text, {
            "score": 5, "classification": "weak",
            "next_focus": "Move to new topic",
            "feedback": "Could not parse AI evaluation.",
        })

    async def generate_question_v2(
        self, role, difficulty, stage, weak_areas, strong_areas, directive
    ) -> str:
        prompt = f"""You are a human-like technical interviewer.

INPUT:
- Role: {role}
- Difficulty: {difficulty}
- Stage: {stage}
- Weak Areas: {weak_areas}
- Strong Areas: {strong_areas}
- Directive: {directive}

RULES:
- Ask ONE question only. No preamble.
- If directive says "Drill down", ask a follow-up on the same topic.
- If "Move on", ask a fresh topic question.
- Match depth to difficulty and stage.

OUTPUT: Next interview question as plain text only."""
        return self.generate_response(prompt).strip()

    async def generate_final_feedback(
        self, role, difficulty_history, question_count, strong_areas, weak_areas,
        recent_critical_mistakes, average_score, non_verbal_stats=None,
    ) -> dict:
        prompt = f"""You are a senior technical interviewer giving final candidate feedback.

INPUT DATA:
- Role: {role}
- Interview Difficulty Range: {difficulty_history}
- Total Questions Asked: {question_count}
- Strong Areas: {strong_areas}
- Weak Areas: {weak_areas}
- Critical Mistakes: {recent_critical_mistakes}
- Average Score: {average_score}
- Non-Verbal Behavior: {non_verbal_stats or 'No data available.'}

TASK: Generate final interview feedback as JSON only.

OUTPUT JSON:
{{
  "overall_score": <number 1-10>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "difficulty_trend": "<improved|stable|declined>",
  "improvement_tips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "final_verdict": "<one paragraph summary of candidate readiness>"
}}"""
        text = self._generate_json(prompt)
        return self._extract_json(text, {
            "overall_score": average_score,
            "strengths": strong_areas,
            "weaknesses": weak_areas,
            "final_verdict": "Could not generate detailed feedback.",
        })


llm_service = LLMService()
