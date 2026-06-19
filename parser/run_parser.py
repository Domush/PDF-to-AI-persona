import subprocess
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
PYTHON = "python"

if __name__ == "__main__":
    parser_script = SCRIPT_DIR / "pdf_parser.py"
    print(f"Running parser: {parser_script}")
    result = subprocess.run([PYTHON, str(parser_script)], cwd=PROJECT_ROOT)
    if result.returncode != 0:
        raise SystemExit(result.returncode)
