import argparse
import hashlib
import json
from pathlib import Path

# Load configuration
CONFIG_FILE = Path(__file__).resolve().parent / 'config.json'
with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
    CONFIG = json.load(f)

PDF_ROOT = Path(CONFIG['data'].get('pdf_root', 'pdf')).resolve()
PREPARED_FILENAME = CONFIG['data'].get('prepared_output_file_name', 'prepared_documents.json')
MIN_WORDS = CONFIG['data']['min_words']


def word_count(text: str) -> int:
    return len(text.split())


def fix_unicode_text(text: str) -> str:
    replacements = {
        "’": "'",
        "‘": "'",
        "“": '"',
        "”": '"',
        "–": "-",
        "—": "-",
        "…": "...",
    }
    fixed = text
    for src, dst in replacements.items():
        fixed = fixed.replace(src, dst)
    return fixed.strip()


def build_source_id(text: str, source_file: str, section_title: str) -> str:
    seed = f"pdf|{source_file}|{section_title}|{text.strip()}"
    return hashlib.sha256(seed.encode('utf-8')).hexdigest()


def write_json_output(output_file: Path, payload: list[dict]) -> None:
    output_file.parent.mkdir(parents=True, exist_ok=True)
    if output_file.exists():
        print(f"Overwriting existing prepared documents file: {output_file}")
    else:
        print(f"Creating prepared documents file: {output_file}")
    with output_file.open('w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)


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


def load_section_files(json_dir: Path) -> list[dict]:
    section_files = sorted(json_dir.glob('*.json'))
    payload = []
    for section_file in section_files:
        with section_file.open('r', encoding='utf-8') as f:
            sections = json.load(f)
        for section in sections:
            content = fix_unicode_text(section.get('content', ''))
            if word_count(content) < MIN_WORDS:
                continue
            metadata = {
                'source_file': section_file.name,
                'section_title': section.get('title', ''),
                'date': section.get('date', ''),
                'pdf_dir': json_dir.parent.name,
                'source_type': 'pdf_section',
            }
            payload.append({
                'text': content,
                'metadata': metadata,
                'source_id': build_source_id(content, section_file.name, section.get('title', '')),
            })
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Prepare cleaned PDF section documents for memory import.'
    )
    parser.add_argument('--dir', help='Name of the PDF subdirectory under pdf to process.')
    args = parser.parse_args()

    selected_dir = select_directory(args.dir)
    json_dir = selected_dir / 'json'
    print(f"Processing PDF JSON directory: {selected_dir.name}")

    prepared_docs = load_section_files(json_dir)
    output_file = selected_dir / PREPARED_FILENAME
    write_json_output(output_file, prepared_docs)
    print(f"Prepared {len(prepared_docs)} document sections from {len(list(json_dir.glob('*.json')))} files.")
    print(f"Output written to {output_file}")


if __name__ == '__main__':
    main()
