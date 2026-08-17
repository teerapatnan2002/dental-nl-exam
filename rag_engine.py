import os

# Global variables to cache the embeddings and vectorstore so we don't reload them on every request
_embeddings = None
_vectorstore = None

def _get_vectorstore():
    global _embeddings, _vectorstore
    index_dir = "faiss_index"
    
    if not os.path.exists(index_dir):
        return None
        
    if _vectorstore is None:
        if _embeddings is None:
            # Lazy import to prevent massive RAM usage on app startup (useful for 512MB Render free tier)
            try:
                from langchain_huggingface import HuggingFaceEmbeddings
                from langchain_community.vectorstores import FAISS
            except ImportError:
                return None
            _embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        
        # Load the FAISS index. allow_dangerous_deserialization=True is required for local files.
        _vectorstore = FAISS.load_local(index_dir, _embeddings, allow_dangerous_deserialization=True)
        
    return _vectorstore

def search_vault(query: str, k: int = 3) -> str:
    """
    Search the Obsidian FAISS vector database for the given query.
    Returns a concatenated string of the most relevant markdown chunks.
    """
    vectorstore = _get_vectorstore()
    if not vectorstore:
        return "" # No KB available, just return empty string
        
    try:
        # Perform similarity search
        docs = vectorstore.similarity_search(query, k=k)
        
        context_parts = []
        for i, doc in enumerate(docs):
            source = doc.metadata.get('source', 'Unknown File')
            # Extract just the filename from the source path
            filename = os.path.basename(source)
            context_parts.append(f"--- Document: {filename} ---\n{doc.page_content}")
            
        return "\n\n".join(context_parts)
    except Exception as e:
        print(f"RAG Engine Error: {e}")
        return ""
