"""
scripts/test_rag.py
Quick test script to verify the RAG pipeline works correctly.
Run: python scripts/test_rag.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv()

def test_pipeline():
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel

    console = Console()
    console.print("\n[bold cyan]🤖 RAG Pipeline Test[/bold cyan]\n")

    # Initialize
    console.print("[yellow]Initializing RAG pipeline...[/yellow]")
    from rag.pipeline import RAGPipeline
    rag = RAGPipeline()
    console.print(f"[green]✅ Pipeline ready. Indexed chunks: {rag.vector_store.collection.count()}[/green]\n")

    # Test queries
    test_cases = [
        {"query": "What are Anurag's strongest skills?",          "expected_category": "skills"},
        {"query": "What internships has he completed?",            "expected_category": "experience"},
        {"query": "Tell me about the EV prediction project",       "expected_category": "project"},
        {"query": "What certifications does he have?",             "expected_category": "certifications"},
        {"query": "What role is he best suited for?",              "expected_category": "value_proposition"},
        {"query": "Where did he study?",                           "expected_category": "education"},
        {"query": "Is he available for hire?",                     "expected_category": "identity"},
        {"query": "What deep learning experience does he have?",   "expected_category": "experience"},
    ]

    table = Table(title="RAG Test Results", show_header=True)
    table.add_column("Query", style="cyan", width=40)
    table.add_column("Top Source", style="green")
    table.add_column("Confidence", style="yellow")
    table.add_column("Status", style="bold")

    all_passed = True
    for tc in test_cases:
        result = rag.answer(tc["query"], use_cache=False)
        top_source = result["sources"][0]["category"] if result["sources"] else "none"
        confidence = result["confidence"]
        passed = confidence > 0.3 and len(result["reply"]) > 50

        status = "[green]✓ PASS[/green]" if passed else "[red]✗ FAIL[/red]"
        table.add_row(
            tc["query"][:38] + "..." if len(tc["query"]) > 38 else tc["query"],
            top_source,
            f"{confidence:.2f}",
            status,
        )
        if not passed:
            all_passed = False

    console.print(table)

    # Full response for one query
    console.print("\n[bold]Sample full response:[/bold]")
    demo = rag.answer("What are Anurag's strongest skills?", use_cache=False)
    console.print(Panel(demo["reply"], title="Response", border_style="cyan"))

    if all_passed:
        console.print("\n[bold green]✅ All tests passed! RAG pipeline is working correctly.[/bold green]")
    else:
        console.print("\n[bold yellow]⚠️  Some tests need attention. Check Ollama model and indexing.[/bold yellow]")

    return all_passed

if __name__ == "__main__":
    success = test_pipeline()
    sys.exit(0 if success else 1)
