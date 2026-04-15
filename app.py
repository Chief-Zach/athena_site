import re
from pathlib import Path

import markdown
from flask import Flask, render_template, abort
from markupsafe import Markup

app = Flask(__name__)

WIKI_DIR = Path(__file__).parent / "wiki_src"

# Ordered list of docs pages: (slug, nice title, filename)
DOCS_PAGES = [
    ("home",         "Introduction",                 "Home.md"),
    ("routes",       "About the Routes",             "About-the-Routes.md"),
    ("creating",     "Creating a New Page or Game",  "Creating-a-New-Page-Or-Game.md"),
    ("templates",    "Templates, Classes & Functions", "Templates,-Classes,-and-Functions.md"),
    ("llm",          "LLM Configuration",            "LLM-Configuration.md"),
    ("deploying",    "Deploying",                    "Deploying.md"),
]

MD_EXTENSIONS = ["fenced_code", "tables", "codehilite", "sane_lists", "toc"]


def _render_markdown(text: str) -> str:
    # Clean up wiki-style internal links so they work inside our SPA
    # e.g. [About the Routes](Deploying.md) -> #routes
    slug_for_file = {fn: slug for slug, _, fn in DOCS_PAGES}
    def link_sub(m):
        label, target = m.group(1), m.group(2)
        target = target.split("#")[0]
        slug = slug_for_file.get(target)
        if slug:
            return f"[{label}](#{slug})"
        return m.group(0)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+\.md)\)", link_sub, text)

    html = markdown.markdown(
        text,
        extensions=MD_EXTENSIONS,
        extension_configs={"codehilite": {"guess_lang": False, "noclasses": True,
                                          "pygments_style": "monokai"}},
    )
    return html


def load_docs():
    pages = []
    for slug, title, filename in DOCS_PAGES:
        path = WIKI_DIR / filename
        raw = path.read_text(encoding="utf-8") if path.exists() else f"*Missing: {filename}*"
        pages.append({
            "slug": slug,
            "title": title,
            "html": Markup(_render_markdown(raw)),
        })
    return pages


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/docs")
@app.route("/docs/")
def docs():
    return render_template("docs.html", pages=load_docs())


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
