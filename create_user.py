import datetime
from database import SessionLocal
from models import User
from auth import get_password_hash

db = SessionLocal()
existing = db.query(User).filter(User.username == "testuser").first()
if not existing:
    hashed_password = get_password_hash("password123")
    new_user = User(
        username="testuser",
        email="testuser@example.com",
        hashed_password=hashed_password,
        created_at=datetime.datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    print("Created testuser / password123")
else:
    print("testuser already exists.")
