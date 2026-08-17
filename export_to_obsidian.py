import os
import json
import shutil
from dotenv import load_dotenv
load_dotenv()
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Question, Choice

def clean_filename(text):
    """Sanitize strings for use as filenames."""
    if not text:
        return "Unknown"
    invalid_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*']
    for char in invalid_chars:
        text = text.replace(char, '_')
    return text[:50].strip()

def export_to_obsidian():
    vault_dir = "Obsidian_NL_Exam"
    attachments_dir = os.path.join(vault_dir, "attachments")
    
    # Create directories
    os.makedirs(vault_dir, exist_ok=True)
    os.makedirs(attachments_dir, exist_ok=True)
    
    db = SessionLocal()
    questions = db.query(Question).all()
    
    count = 0
    for q in questions:
        count += 1
        
        # Determine tags
        tags = []
        if q.category:
            tags.append(q.category.replace(" ", "_"))
        if q.task:
            tags.append(q.task.replace(" ", "_"))
        if q.source_exam:
            tags.append(q.source_exam.replace(" ", "_"))
            
        tags_yaml = "\n".join([f"  - {t}" for t in tags])
        
        # Copy image if exists
        image_md = ""
        if q.image_path and os.path.exists(q.image_path):
            img_filename = os.path.basename(q.image_path)
            dest_img = os.path.join(attachments_dir, img_filename)
            if not os.path.exists(dest_img):
                shutil.copy2(q.image_path, dest_img)
            image_md = f"\n\n![[{img_filename}]]\n"

        # Format choices
        choices = db.query(Choice).filter(Choice.question_id == q.id).all()
        choices_text = ""
        for c in choices:
            prefix = "✅ " if c.label == q.correct_answer else "❌ "
            choices_text += f"- {prefix}**{c.label}**: {c.text}\n"

        # Format explanation
        explanation_text = ""
        if q.explanation:
            try:
                # Try to parse as JSON first (from our new AI structure)
                exp_data = json.loads(q.explanation)
                explanation_text += f"\n## คำอธิบาย (Explanation)\n\n"
                explanation_text += f"**Core Principle:**\n{exp_data.get('core_principle', '')}\n\n"
                explanation_text += f"**Choice Breakdown:**\n"
                for label, exp in exp_data.get('choice_explanations', {}).items():
                    explanation_text += f"- **{label}**: {exp}\n"
            except json.JSONDecodeError:
                # Fallback to plain text
                explanation_text = f"\n## คำอธิบาย (Explanation)\n\n{q.explanation}"

        # Markdown Content
        md_content = f"""---
tags:
{tags_yaml}
id: {q.id}
---
# คำถามที่ {q.id}

**Stem:**
{q.stem or ''}

**Proposition:**
{q.proposition or ''}
{image_md}

## ตัวเลือก
{choices_text}
{explanation_text}
"""
        
        # Save file
        # Name format: Q001_Category.md
        safe_cat = clean_filename(q.category)
        filename = f"Q{q.id:04d}_{safe_cat}.md"
        filepath = os.path.join(vault_dir, filename)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(md_content)
            
    db.close()
    print(f"✅ Successfully exported {count} questions to '{vault_dir}'")

if __name__ == "__main__":
    export_to_obsidian()
