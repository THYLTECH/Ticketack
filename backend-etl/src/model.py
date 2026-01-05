from FlagEmbedding import BGEM3FlagModel

_model_instance = None


def get_model():
    """
    Returns the singleton instance of the BGE-M3 model.
    Loads it into memory if not already loaded.
    """
    global _model_instance

    if _model_instance is None:
        print("🧠 [MODEL] Loading BGE-M3"
              "(this may take a while on first run)...", flush=True)
        # use_fp16=True speeds up computation and reduces memory usage without
        # significant loss of precision
        _model_instance = BGEM3FlagModel('BAAI/bge-m3', use_fp16=True)
        print("✅ [MODEL] BGE-M3 loaded and ready.", flush=True)

    return _model_instance
