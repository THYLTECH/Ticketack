# Script to verify LanceDB content and test vector search
import os
import lancedb
from FlagEmbedding import BGEM3FlagModel

# Configuration
DB_PATH = '/data/lancedb'
TABLE_NAME = 'tickets'


def main():
    if not os.path.exists(DB_PATH):
        print(f"❌ No database found at {DB_PATH}")
        return

    db = lancedb.connect(DB_PATH)

    if TABLE_NAME not in db.table_names():
        print(f"❌ Table '{TABLE_NAME}' does not exist yet.")
        return

    table = db.open_table(TABLE_NAME)
    count = len(table)
    print(f"✅ Database connected. Total tickets: {count}")

    if count == 0:
        return

    print("\n--- 🔍 VECTOR SEARCH TEST ---")
    query_text = input("Enter a search query"
                       "(e.g., 'VPN error' or 'screen black'): ")

    if not query_text:
        print("Search cancelled.")
        return

    print("🧠 Vectorizing query...")
    # Loading model just for this CLI test
    model = BGEM3FlagModel('BAAI/bge-m3', use_fp16=True)
    query_vec = model.encode(
        query_text,
        return_dense=True,
        return_sparse=False,
        return_colbert_vecs=False
    )['dense_vecs']

    print(f"🔎 Searching in LanceDB for: '{query_text}'...")

    # Search for nearest neighbors (Semantic Search)
    results = table.search(query_vec).limit(3).to_pandas()

    print("\n🏆 --- TOP RESULTS ---")
    for index, row in results.iterrows():
        # _distance is L2 (Euclidean) by default in LanceDB. Lower is better.
        print(f"#{index + 1} | Distance: {row['_distance']:.4f}")
        print(f"    📂 File:   {row['filename']}")
        print(f"    🎟️ ID:     {row.get('ticket_id', 'N/A')}")
        print(f"    📝 Title:  {row['title']}")
        print(f"    📄 Extract: {row['text'][:150].replace(chr(10), ' ')}...")
        print("-" * 50)


if __name__ == "__main__":
    main()
