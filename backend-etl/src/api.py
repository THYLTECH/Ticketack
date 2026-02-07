from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import lancedb
import os
import time
import pandas as pd
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

        # Oversampling: to retrieve the number of unique tickets requested
        fetch_limit = search.limit * 5

        # Search and convert to Pandas DataFrame
        df_results = table.search(query_vec).limit(fetch_limit).to_pandas()

        if df_results.empty:
            return []

        # 3. Aggregation / Deduplication
        # Sorting by '_distance' ascending
        df_results = df_results.sort_values(by='_distance', ascending=True)

        # Deleting duplicates based on 'ticket_id', keeping first
        # Distance kept is the lowest one due to sorting
        df_unique = df_results.drop_duplicates(
            subset=['ticket_id'],
            keep='first'
        )

        # Keeping only the number requested by the user
        df_final = df_unique.head(search.limit)

        # 4. Format response
        response = []
        for _, row in df_final.iterrows():
            response.append(SearchResult(
                ticket_id=int(row['ticket_id']),
                score=round(float(row['_distance']), 4),
                filename=row.get('filename', 'unknown')
            ))

        duration = (time.time() - start_time) * 1000
        print(f"🔎 [API] Search for '{search.query}' took {duration:.2f}ms. "
              f"Fetched {len(df_results)} raw vectors -> Returned {len(response)} unique tickets.")

        return response

    except Exception as e:
        print(f"❌ [API] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
