from http.client import HTTPException
import logging
import os

from bson import ObjectId
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import BookIn, BookOut
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://root:password@mongo:27017")
DB_NAME = os.getenv("MONGO_DB", "shelvy")

logger = logging.getLogger("uvicorn.error")

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # tighten later if you want
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client: AsyncIOMotorClient | None = None


@app.on_event("startup")
async def startup_db():
    global client
    client = AsyncIOMotorClient(MONGO_URL)
    # will use DB_NAME
    # Optional: verify connection
    await client.admin.command("ping")


@app.on_event("shutdown")
async def shutdown_db():
    client.close()


def get_collection():
    db = client[DB_NAME]
    return db["books"]


@app.get("/api/get-books", response_model=list[BookOut])
async def list_books():
    logger.info("list_books called")
    col = get_collection()
    docs = []
    try:
        async for doc in col.find():
            logger.info(f"Raw doc: {doc}")
            doc["_id"] = str(doc["_id"])
            docs.append(doc)
        logger.info(f"Returning docs: {docs}")
        return docs
    except Exception as e:
        logger.exception("Error in list_books")
        raise


@app.post("/api/add-books", response_model=BookOut)
async def create_book(book: BookIn):
    col = get_collection()
    doc = book.dict()
    result = await col.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


@app.delete("/api/delete-book")
async def delete_book(book: BookIn):
    col = get_collection()
    # Delete by unique id field from book
    result = await col.delete_one({"id": book.id})  # Use book.id or equivalent
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Book not found")
    return None
