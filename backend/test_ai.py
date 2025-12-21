from app.services.llm_service import llm_service
import asyncio

async def test():
    print("Testing Model Loading...")
    try:
        llm_service.load_model()
        print("✅ Model Loaded!")
        
        print("Testing Generation...")
        response = await llm_service.generate_question("Frontend Developer", "easy", "React", [])
        print(f"✅ Response received: {response}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
