from typing import Optional

from pydantic import BaseModel, Field


class BookIn(BaseModel):
    title: str
    author: str
    isbn: Optional[str] = None
    coverUrl: Optional[str] = None
    shelfId: Optional[int] = None
    openLibId: Optional[str] = None
    pages: Optional[int] = None


class BookOut(BookIn):
    id: str = Field(alias="_id")
