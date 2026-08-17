import json
import sys
from database import engine, SessionLocal, Base
from models import Question, Choice

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

def import_data(json_file: str):
    db = SessionLocal()
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        questions = data.get("questions", [])
        print(f"Found {len(questions)} questions in {json_file}")
        
        count = 0
        for q_data in questions:
            # Create Question
            db_question = Question(
                question_text=q_data["question_text"],
                correct_answer=q_data.get("correct_answer"),
                category=q_data["category"],
                task=q_data["task"],
                explanation=q_data.get("explanation"),
                source_exam=q_data.get("source_exam")
            )
            db.add(db_question)
            db.flush() # flush to get the id
            
            # Add Choices
            choices_data = q_data.get("choices", [])
            for c_data in choices_data:
                db_choice = Choice(
                    question_id=db_question.id,
                    label=c_data["label"],
                    text=c_data["text"]
                )
                db.add(db_choice)
            
            count += 1
            
        db.commit()
        print(f"Successfully imported {count} questions into the database.")
        
    except Exception as e:
        print(f"Error importing data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    
    # Check if exam_bank.json exists
    if len(sys.argv) > 1:
        json_file = sys.argv[1]
    else:
        json_file = "exam_bank.json"
        
    import_data(json_file)
