# Digital Persona Memory App

Builds a searchable memory bank from PDF content and exposes it as an MCP tool.

Add it as an MCP server in your favorite AI client (eg: LM Studio) with the included system prompt and chat with your heroes, historical figures, or any collection of PDF content. 

Example personas are included for Karl Marx and Friedrich Engels. The personas are built from every work both figures ever published. You can chat, ask them questions, or even debate them as though they were still alive and they'll respond based on their own publicly available works.

Alternative uses include adding your school textbooks in PDF format and asking them questions. No more finding that one page, just ask it to explain whatever you want to know.

A [modified version of this app](https://github.com/Domush/Facebook-to-LLM-Avatar) is used to bring Facebook users to life as Digital Personas using their exported Facebook data.

## What This App Does

- extracts and indexes persona content from PDF-derived JSON sections
- builds per-person Chroma memory databases
- serves an MCP search tool with semantic ranking plus recency scoring
- supports multiple personas by adding folders under `pdf/`

## Core Features

- `parser/` contains PDF parsing tools to turn PDF persona text into JSON section files.
- `2_build_memory.py` embeds documents and builds a Chroma memory DB.
- `3_avatar_mcp.py` exposes `search_my_memory()` as an MCP tool.
- `--name` lets you create and query separate memory databases for different personas.
- `config.json` centralizes paths, embedding server settings, memory DB defaults, and search tuning.

## Project Files

- `1_prep_data.py`: Prepare imported JSON data and normalize text for memory import.
- `2_build_memory.py`: Build the Chroma memory database with optional persona selection.
- `3_avatar_mcp.py`: Run the MCP server and query the selected memory database.
- `config.json`: Configuration for PDF sources, embeddings, memory DB paths, and search settings.
- `parser/`: PDF downloader and parser utilities for creating JSON section files from PDFs.

## Python Requirements

Install dependencies in your virtual environment:

```bash
pip install -r requirements.txt
```

## Data Layout

### PDF Persona Support

Each persona owns a directory under `pdf/`.
For example:

- `pdf/marx/` (Karl Marx persona, included as a sample)
- `pdf/engles/` (Friedrich Engels persona, included as a sample)

### Memory DB Layout

The memory database lives under the base path in `config.json`.
When using `--name`, a separate collection directory is created:

- `avatar_memory_db/marx/`
- `avatar_memory_db/engles/`

Each persona DB contains Chroma persistence files plus a `document_index.json`.

## LM Studio Setup

Before building or querying memory:

1. Start LM Studio's Local Server.
2. Load the embedding model configured in `config.json`.
3. Confirm `embeddings.api_base` matches the Local Server URL.

## End-to-End Workflow

### 1) Add persona-specific PDF data or formatted JSON sections

Option 1: Add PDF files in `pdf/<persona>/` and run the parser tools in `parser/` to create JSON section files in `pdf/<persona>/json/`.

You will need to edit the parser tools to meet your specific PDF structure and content. The included `parser/` tools are a starting point for common PDF layouts.

Option 2: Add JSON section files directly in `pdf/<persona>/json/`.
The JSON files should be structured as:

```json
{
  "sections": [
    {
      "title": "Section Title",
      "text": "Section text content...",
      "timestamp": "2024-01-01T00:00:00Z" // Timestamp is optional but recommended for recency scoring
    },
    ...
  ]
}
```

### 2) Prepare JSON data for ingestion

```bash
python 1_prep_data.py
```

This will normalize the text and prepare the JSON sections for embedding. It will prompt you to select a persona if multiple are present.

### 3) Build the memory DB

Option 1: Build default collection (no persona name specified. Will use `config.json` default collection name):

```bash
python 2_build_memory.py
```

Option 2: Build a named persona collection:

JSON files for Karl Marx and Friedrich Engels are included as examples.

```bash
python 2_build_memory.py --name marx
```

```bash
python 2_build_memory.py --name engles
```

### 4) Start the MCP server

Option 1: Run the default DB server:

```bash
python 3_avatar_mcp.py
```

Option 2: Run a named persona DB server:

```bash
python 3_avatar_mcp.py --name marx
```

```bash
python 3_avatar_mcp.py --name engles
```

The exposed MCP tool is:

```python
search_my_memory(topic, num_results=...)
```

## Search Behavior

Results are ranked by:

- semantic similarity from embeddings
- an optional recency boost

Tune behavior in `config.json`:

- `search.default_num_results`
- `search.candidate_multiplier`
- `search.recency_half_life_days`
- `search.recency_weight_alpha`

## Troubleshooting

- No memory results:
  - Confirm `pdf/<persona>/json/` files exist.
  - Confirm prepared_documents.json exists in the persona folder (or whatever filename you specified in `config.json`).
  - Rebuild the memory DB.
- Collection or DB errors:
  - Verify `memory_db.path` and `collection_name` in `config.json`.
  - Use `--name` consistently for build and server.
- LM Studio errors:
  - Confirm the Local Server is running with embedding model loaded.
  - Check `embeddings.api_base`, and ensure the model name in `config.json` match LM Studio's model name.
- Long build times:
  - Large persona data can take 5-10+ minutes depending on hardware and embedding throughput.

## Screenshot of this in action

<img width="1408" height="751" alt="image" src="https://github.com/user-attachments/assets/c374217b-79eb-4d63-8d56-7f8396264fd8" />
