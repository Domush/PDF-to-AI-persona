import os
from pathlib import Path
from urllib.parse import urljoin

import requests

BASE_URL = 'https://www.marxists.org/archive/marx/works/download/index.htm'
SCRIPT_DIR = Path(__file__).resolve().parent
TARGET_DIR = (SCRIPT_DIR.parent / 'pdf' / 'engles').resolve()
TARGET_DIR.mkdir(parents=True, exist_ok=True)

ENGELS_LINKS = [
    'Engels_Socialism_Utopian_and_Scientific.pdf',
    'pdf/Articles_Labour_Standard.pdf',
    'pdf/Brentano_vs_Marx.pdf',
    'pdf/Death_Karl_Marx.pdf',
    'pdf/History_Early_Christianity.pdf',
    'pdf/Housing_Question.pdf',
    'pdf/Ludwig_Feuerbach.pdf',
    'pdf/Peasant_Question.pdf',
    'pdf/Synopsis_of_Capital.pdf',
    'pdf/anti_duhring.pdf',
    'pdf/campaign-german-imperial-constitution.pdf',
    'pdf/condition-working-class-england.pdf',
    'pdf/dialectics-nature.pdf',
    'pdf/origin_family.pdf',
    'pdf/peasant-war-germany.pdf',
    'pdf/principles-communism.pdf',
    'pdf/revolution-counterrevolution-germany.pdf',
]


def download(url, target_path):
    print(f'Downloading {url}...')
    response = requests.get(url, stream=True, timeout=60)
    response.raise_for_status()
    with open(target_path, 'wb') as f:
        for chunk in response.iter_content(8192):
            if chunk:
                f.write(chunk)


def main():
    for link in ENGELS_LINKS:
        url = urljoin(BASE_URL, link)
        file_name = Path(link).name
        target_path = TARGET_DIR / file_name
        if target_path.exists():
            print(f'Skipping existing file: {file_name}')
            continue
        download(url, target_path)
    print('\nDownload complete.')


if __name__ == '__main__':
    main()
