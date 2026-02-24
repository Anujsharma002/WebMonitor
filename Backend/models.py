from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from datetime import datetime
from db import Base

class Link(Base):
    __tablename__ = "links"
    id = Column(Integer, primary_key=True)
    url = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.now)

class Check(Base):
    __tablename__ = "checks"
    id = Column(Integer, primary_key=True)
    link_id = Column(Integer, ForeignKey("links.id"))
    fetched_at = Column(DateTime, default=datetime.now)
    raw_text = Column(Text)
    diff_text = Column(Text)
    summary = Column(Text)
    changed = Column(Boolean)