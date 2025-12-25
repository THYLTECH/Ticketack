from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import lancedb
import os
import time
from .model import get_model

# Initialize FastAPI
app = FastAPI(title="TicketAck Search API")

# Configuration
LANCEDB_PATH = os.getenv('LANCEDB_PATH', '/data/lancedb')
TABLE_NAME = "tickets"


# Data Models (Request/Response)
class SearchQuery(BaseModel):
    query: str
    limit: int = 5


class SearchResult(BaseModel):
    ticket_id: int
    score: float
    filename: str  # Useful for debugging


@app.on_event("startup")
async def startup_event():
    """
    Load the model into memory when the API starts.
    This prevents loading it for every single request.
    """
    print("🚀 [API] Starting up... Loading BGE-M3 model...")
    get_model()  # Forces model loading
    print("✅ [API] Model loaded.")


def get_db_table():
    """Helper to get the LanceDB table"""
    if not os.path.exists(LANCEDB_PATH):
        raise HTTPException(
            status_code=500,
            detail="Database not initialized yet."
        )

    db = lancedb.connect(LANCEDB_PATH)
    if TABLE_NAME not in db.table_names():
        raise HTTPException(
            status_code=404,
            detail=f"Table '{TABLE_NAME}' not found."
        )

    return db.open_table(TABLE_NAME)


@app.post("/search", response_model=List[SearchResult])
async def search_tickets(search: SearchQuery):
    """
    Vectorizes the query and searches in LanceDB.
    Returns IDs and Relevance Score.
    """
    start_time = time.time()

    if not search.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        # 1. Vectorize the query
        model = get_model()
        # We only need the dense vector for the search query for now
        output = model.encode(
            search.query,
            return_dense=True,
            return_sparse=False,
            return_colbert_vecs=False
        )
        query_vec = output['dense_vecs']

        # 2. Search in LanceDB
        table = get_db_table()

        # Search and convert to Pandas DataFrame
        results = table.search(query_vec).limit(search.limit).to_pandas()

        # 3. Format response
        response = []
        for _, row in results.iterrows():
            # Convert L2 Distance to Similarity Score (Approximate)
            # Distance 0 -> Score 1.0
            # Distance 1 -> Score 0.0
            distance = row['_distance']
            similarity_score = max(0.0, 1.0 - distance)

            response.append(SearchResult(
                ticket_id=row.get('ticket_id', 0),
                score=round(similarity_score, 4),
                filename=row.get('filename', 'unknown')
            ))

        duration = (time.time() - start_time) * 1000
        print(f"🔎 [API] Search for '{search.query}' took {duration:.2f}ms."
              f"Found {len(response)} results.")

        return response

    except Exception as e:
        print(f"❌ [API] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
