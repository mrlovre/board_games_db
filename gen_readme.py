from pathlib import Path
from urllib.parse import quote


def main():
    root = Path(__file__).resolve().parent
    images = sorted(
        (path for path in (root / "png").iterdir()
         if path.is_file() and path.suffix.lower() == ".png"),
        key=lambda path: path.name,
    )
    entries = []
    for path in images:
        label = path.stem.replace("\\", "\\\\").replace("[", "\\[").replace("]", "\\]")
        entries.append(f"![{label}]({quote(path.relative_to(root).as_posix())})")
    (root / "README.md").write_text(
        "\n\n".join(entries) + ("\n" if entries else ""), encoding="utf-8"
    )
    print(f"Added {len(images)} images to README.md")


if __name__ == "__main__":
    main()
