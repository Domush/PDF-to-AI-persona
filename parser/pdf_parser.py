import argparse
import json
import re
from pathlib import Path

import pdfplumber
import pypdf

META_PREFIXES = [
    "source:",
    "translated:",
    "transcribed:",
    "proofed:",
    "first published:",
    "published:",
    "written:",
    "language:",
    "online version:",
]

METADATA_KEYWORDS = [
    "foreword",
    "preface",
    "introduction",
    "note",
    "translator",
    "transcriber",
    "source",
    "published",
    "translated",
    "proofed",
    "transcribed",
    "dedication",
    "contents",
    "table of contents",
    "biography",
]

HEADING_TOKEN_RE = re.compile(
    r"^(chapter|section|book|part|appendix|conclusion|afterword|notes|epilogue|postscript|chapter|section|book|part)\b",
    re.I,
)
HEADING_NUMBER_RE = re.compile(r"^(?:\d+[\.)]?|[ivxlcdm]+[\.)]?)\s*(?:[:\-\.].*)?$", re.I)
UPPERCASE_TITLE_RE = re.compile(r"^[A-Z0-9 ,;'\-()\.]+$")

FOOTER_RE = re.compile(r"^(page\s*\d+|\d+|\d+\s+of\s+\d+|http[s]?://|marxists\.org|archive/marx/works)", re.I)
TOC_RE = re.compile(r"\.{3,}\s*\d+$")


def extract_page_text(path, page_number):
    """Extract text from a single PDF page using pdfplumber, with pypdf fallback."""
    with pdfplumber.open(path) as pdf:
        try:
            text = pdf.pages[page_number].extract_text()
        except Exception:
            text = None
    if text and len(text.strip()) >= 10:
        return text

    reader = pypdf.PdfReader(str(path))
    page = reader.pages[page_number]
    try:
        fallback_text = page.extract_text()
    except Exception:
        fallback_text = ""
    return fallback_text or ""


def extract_text(path):
    """Extract text from all pages of a PDF, returning cleaned lines."""
    lines = []
    with pdfplumber.open(path) as pdf:
        for page_number in range(len(pdf.pages)):
            text = extract_page_text(path, page_number)
            if not text:
                continue
            page_lines = [line.rstrip() for line in text.splitlines()]
            lines.extend(page_lines)
    return lines


def normalize_line(line):
    return " ".join(line.strip().split())


def is_footer_line(line):
    cleaned = normalize_line(line)
    if not cleaned:
        return False
    if FOOTER_RE.match(cleaned):
        return True
    if TOC_RE.search(cleaned):
        return True
    return False


def is_metadata_line(line):
    lower = line.strip().lower()
    return any(lower.startswith(prefix) for prefix in META_PREFIXES)


def is_toc_line(line):
    cleaned = normalize_line(line)
    if not cleaned:
        return False
    if TOC_RE.search(cleaned):
        return True
    if any(token in cleaned.lower() for token in ["contents", "chapter", "section", "part", "preface", "introduction"]) and re.search(r"\d+$", cleaned):
        return True
    return False


def clean_lines(raw_lines):
    cleaned = []
    for line in raw_lines:
        if not line or not line.strip():
            cleaned.append("")
            continue
        line_str = normalize_line(line)
        if is_footer_line(line_str) or is_toc_line(line_str):
            continue
        cleaned.append(line_str)
    return cleaned


def merge_hyphenated_lines(lines):
    merged = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.endswith("-") and i + 1 < len(lines):
            next_line = lines[i + 1]
            if next_line and next_line[0].islower():
                line = line[:-1] + next_line
                i += 1
        merged.append(line)
        i += 1
    return merged


def parse_metadata(lines):
    title = None
    date = None
    for line in lines[:50]:
        if not line:
            continue
        lower = line.lower()
        if not title and len(line) <= 120 and any(token in lower for token in ["marx", "manifesto", "capital", "poverty", "critique", "gotha", "jewish question", "holy family", "hague", "communist", "ideology", "rheinishe"]):
            title = line.strip()
        if "written:" in lower:
            date = line.split(":", 1)[1].strip(" ;")
        elif "first published:" in lower and not date:
            date = line.split(":", 1)[1].strip(" ;")
        elif not date and re.search(r"\b(18[3-9]\d|19[0-2]\d)\b", lower):
            found = re.search(r"\b(18[3-9]\d|19[0-2]\d)\b", lower)
            if found:
                date = found.group(0)
    return title, date


def is_heading(line):
    if not line or len(line) > 120:
        return False
    if HEADING_TOKEN_RE.match(line):
        return True
    if HEADING_NUMBER_RE.match(line) and len(line) <= 20:
        return True
    if UPPERCASE_TITLE_RE.match(line) and sum(ch.isalpha() for ch in line) >= 4:
        return True
    return False


def normalize_title(line, book_title):
    candidate = line.strip()
    if not candidate:
        return candidate
    if HEADING_NUMBER_RE.match(candidate) and book_title:
        return f"{book_title}: {candidate}"
    if HEADING_TOKEN_RE.match(candidate) and book_title and not candidate.lower().startswith(book_title.lower()):
        return f"{book_title}: {candidate}"
    return candidate


def sectionize(lines, book_title):
    sections = []
    current_title = None
    current_text = []
    started = False

    for line in lines:
        if not line:
            if started and current_text:
                current_text.append("")
            continue

        if is_heading(line):
            title = normalize_title(line, book_title)
            if current_title and current_text:
                sections.append({
                    "title": current_title,
                    "content": "\n".join(current_text).strip(),
                })
                current_text = []
            current_title = title
            started = True
            continue

        if not started:
            current_title = book_title or "Untitled"
            started = True
        current_text.append(line)

    if current_title and current_text:
        sections.append({
            "title": current_title,
            "content": "\n".join(current_text).strip(),
        })
    return sections


def filter_sections(sections):
    filtered = []
    for section in sections:
        title_lower = section["title"].lower()
        if any(keyword in title_lower for keyword in METADATA_KEYWORDS):
            continue
        if not section["content"].strip():
            continue
        filtered.append(section)
    return filtered


def parse_pdf(path):
    raw_lines = extract_text(path)
    lines = clean_lines(raw_lines)
    lines = merge_hyphenated_lines(lines)
    title, date = parse_metadata(lines)
    if not title:
        title = path.stem.replace("_", " ").replace("%20", " ")
    # skip front-matter blocks until substantive text begins
    start_index = 0
    for idx, line in enumerate(lines[:100]):
        if not line:
            continue
        lower = line.lower()
        if is_metadata_line(line) or any(keyword in lower for keyword in METADATA_KEYWORDS):
            continue
        start_index = idx
        break
    lines = lines[start_index:]
    sections = sectionize(lines, title)
    sections = filter_sections(sections)
    for section in sections:
        section["date"] = date or ""
    return sections


def write_json(output_dir, path, sections):
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / (path.stem + ".json")
    output_path.write_text(json.dumps(sections, indent=2, ensure_ascii=False), encoding="utf-8")


def parse_directory(pdf_dir, output_dir):
    pdf_dir = Path(pdf_dir).resolve()
    output_dir = Path(output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    summary = []
    for pdf_path in sorted(pdf_dir.glob("*.pdf")):
        print(f"Parsing {pdf_path.name}...")
        sections = parse_pdf(pdf_path)
        write_json(output_dir, pdf_path, sections)
        summary.append((pdf_path.name, len(sections)))
    print("\nParsing complete.")
    for name, count in summary:
        print(f"{name}: {count} sections")


def main():
    parser = argparse.ArgumentParser(description="Parse PDF files into JSON sections.")
    parser.add_argument("--pdf-dir", default="../pdf/marx", help="Directory containing PDF files to parse.")
    parser.add_argument("--output-dir", help="Directory to write JSON files. If omitted, writes to <pdf-dir>/json.")
    args = parser.parse_args()

    pdf_dir = Path(args.pdf_dir).resolve()
    output_dir = Path(args.output_dir).resolve() if args.output_dir else pdf_dir / "json"
    parse_directory(pdf_dir, output_dir)


if __name__ == "__main__":
    main()
