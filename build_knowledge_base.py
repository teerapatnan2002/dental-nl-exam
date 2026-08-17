import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

def build_kb():
    vault_dir = "Obsidian_NL_Exam"
    index_dir = "faiss_index"
    
    if not os.path.exists(vault_dir):
        print(f"Directory {vault_dir} not found. Please export to Obsidian first.")
        return

    print("Loading Markdown files from Obsidian Vault...")
    # Load all markdown files in the vault
    loader = DirectoryLoader(vault_dir, glob="**/*.md", loader_cls=TextLoader)
    documents = loader.load()
    
    print(f"Loaded {len(documents)} files. Splitting text into chunks...")
    # Split text into manageable chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} text chunks.")
    
    print("Generating Embeddings... (This may take a minute if downloading the model for the first time)")
    # Using a fast, lightweight local embedding model
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    print("Building FAISS Vector Database...")
    vectorstore = FAISS.from_documents(chunks, embeddings)
    
    print(f"Saving Vector Database to '{index_dir}'...")
    vectorstore.save_local(index_dir)
    print("✅ Knowledge Base built successfully!")

if __name__ == "__main__":
    build_kb()
