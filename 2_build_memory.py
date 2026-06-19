import argparse
import json
import os
import shutil
from pathlib import Path
from langchain_openai import OpenAIEmbeddings

# Load configuration
CONFIG_FILE = Path(__file__).resolve().parent / 'config.json'
with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
    CONFIG = json.load(f)

try:
    from langchain.schema import Document
except ModuleNotFoundError:
    try:
        from langchain_core.documents import Document
    except ModuleNotFoundError as exc:
        raise ModuleNotFoundError(
            "Missing Document dependency. Install with: pip install langchain-core"
        ) from exc

try:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
except ModuleNotFoundError:
    try:
        from langchain_text_splitters import RecursiveCharacterTextSplitter
    except ModuleNotFoundError as exc:
        raise ModuleNotFoundError(
            "Missing text splitter dependency. Install with: "
            "pip install langchain-text-splitters"
        ) from exc

try:
    from langchain_community.vectorstores import Chroma
except ModuleNotFoundError:
    try:
        from langchain.vectorstores import Chroma
    except ModuleNotFoundError as exc:
        raise ModuleNotFoundError(
            "Missing Chroma dependency. Install with: "
            "pip install langchain-community chromadb"
        ) from exc

MEMORY_DB_PATH = CONFIG['memory_db']['path']
DOCUMENT_INDEX_FILE = CONFIG['memory_db']['document_index_file']
PDF_ROOT = Path(CONFIG['data'].get('pdf_root', 'pdf')).resolve()
PREPARED_FILENAME = CONFIG['data'].get('prepared_output_file_name', 'prepared_documents.json')


def get_pdf_directories() -> list[Path]:
    if not PDF_ROOT.exists() or not PDF_ROOT.is_dir():
        raise FileNotFoundError(f"PDF root directory not found: {PDF_ROOT}")
    return sorted(
        [p for p in PDF_ROOT.iterdir() if p.is_dir() and (p / 'json').is_dir()],
        key=lambda p: p.name.lower(),
    )


def select_directory(dir_name: str | None = None) -> Path:
    dirs = get_pdf_directories()
    if not dirs:
        raise FileNotFoundError(f"No PDF directories found under {PDF_ROOT}")
    if dir_name:
        selected = PDF_ROOT / dir_name
        if selected not in dirs:
            raise FileNotFoundError(f"Directory not found or missing json subfolder: {selected}")
        return selected
    print("Available PDF directories:")
    for idx, d in enumerate(dirs, start=1):
        print(f"  {idx}. {d.name}")
    choice = input(f"Select a directory [1-{len(dirs)}]: ").strip()
    while not choice.isdigit() or not (1 <= int(choice) <= len(dirs)):
        choice = input(f"Invalid choice. Enter a number from 1 to {len(dirs)}: ").strip()
    return dirs[int(choice) - 1]


def load_documents(prepared_file: Path) -> list[dict]:
    with prepared_file.open('r', encoding='utf-8') as f:
        return json.load(f)


def build_documents(raw_documents: list[dict]) -> list[Document]:
    docs = []
    for item in raw_documents:
        text = item.get('text', '')
        metadata = item.get('metadata', {})
        if not text.strip():
            continue
        docs.append(Document(page_content=text, metadata=metadata))
    return docs


def get_memory_db_path(name: str | None = None) -> Path:
    base_path = Path(CONFIG['memory_db']['path'])
    if not base_path.is_absolute():
        base_path = Path(__file__).resolve().parent / base_path
    return (base_path / name).resolve() if name else base_path.resolve()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Build a memory index from PDF documents.')
    parser.add_argument('--dir', help='Name of the PDF subdirectory under pdf to use.')
    parser.add_argument('--name', help='Optional person/collection name for this memory database.')
    parser.add_argument('--wipe', action='store_true', help='Wipe the existing memory database before building.')
    parser.add_argument(
        '--chunk-size',
        type=int,
        choices=[250, 500, 1000, 2000, 3000],
        default=CONFIG['memory_db'].get('chunk_size', 500),
        help=f"Chunk size for text splitting (default: {CONFIG['memory_db'].get('chunk_size', 500)}).",
    )
    args = parser.parse_args()

    chunk_size = args.chunk_size or CONFIG['memory_db'].get('chunk_size', 500)
    memory_db_path = get_memory_db_path(args.name)

    selected_dir = select_directory(args.dir)
    prepared_file = selected_dir / PREPARED_FILENAME
    if not prepared_file.exists():
        raise FileNotFoundError(
            f"Prepared documents file not found: {prepared_file}. Run 1_prep_data.py first."
        )

    if args.wipe and os.path.exists(memory_db_path):
        print(f"Wiping existing memory bank at {memory_db_path}...")
        shutil.rmtree(memory_db_path)
        print("Memory bank wiped.")
    elif CONFIG['memory_db']['wipe_existing_on_rebuild'] and os.path.exists(memory_db_path):
        print(f"Wiping existing memory bank at {memory_db_path}... ")
        shutil.rmtree(memory_db_path)
        print("Memory bank wiped.")

    embeddings = OpenAIEmbeddings(
        base_url=CONFIG['embeddings']['api_base'],
        api_key=CONFIG['embeddings']['api_key'],
        model=CONFIG['embeddings']['model_name'],
        check_embedding_ctx_length=False,
    )

    raw_documents = load_documents(prepared_file)
    documents = build_documents(raw_documents)
    print(f"Loaded {len(documents)} documents from {prepared_file}")

    document_index = {}
    for doc in documents:
        source_id = doc.metadata.get('source_id')
        if not source_id:
            continue
        document_index[source_id] = {
            'text': doc.page_content,
            'metadata': doc.metadata,
        }

    os.makedirs(memory_db_path, exist_ok=True)
    index_path = os.path.join(memory_db_path, DOCUMENT_INDEX_FILE)
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(document_index, f, ensure_ascii=False, indent=2)

    print(f"Saved full-document index with {len(document_index)} entries.")

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=50)
    docs = text_splitter.split_documents(documents)
    print(f"Embedding {len(docs)} chunks using chunk size {chunk_size}. This may take 5-10 minutes for large datasets...")

    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=str(memory_db_path),
    )
    print("Memory Bank created successfully!")
