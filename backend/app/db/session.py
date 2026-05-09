from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

# Import all models to register with Beanie
from app.models.user import User
from app.models.interview import Interview
from app.models.resume import Resume

async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    database = client.get_default_database()
    
    await init_beanie(
        database=database,
        document_models=[User, Interview, Resume]
    )
    print("✅ MongoDB Connected Successfully!")
