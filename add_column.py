import sqlite3

def add_image_path_column():
    conn = sqlite3.connect("exam_bank.db")
    cursor = conn.cursor()
    
    # Check if column already exists
    cursor.execute("PRAGMA table_info(questions)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if "image_path" not in columns:
        print("Adding image_path column to questions table...")
        cursor.execute("ALTER TABLE questions ADD COLUMN image_path VARCHAR")
        conn.commit()
        print("Column added successfully.")
    else:
        print("image_path column already exists.")
        
    conn.close()

if __name__ == "__main__":
    add_image_path_column()
