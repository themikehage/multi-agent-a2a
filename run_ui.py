"""
Run the A2A multi-agent system web UI.
"""
import argparse

from web_ui import A2AWebUI


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="A2A Multi-Agent System Web UI")
    parser.add_argument(
        "--port", 
        type=int, 
        default=7860, 
        help="Port to run the web UI on (default: 7860)"
    )
    parser.add_argument(
        "--host", 
        type=str, 
        default="0.0.0.0", 
        help="Host to bind to (default: 0.0.0.0)"
    )
    return parser.parse_args()


def main():
    """Run the web UI."""
    args = parse_args()
    ui = A2AWebUI()
    ui.run(host=args.host, port=args.port)


if __name__ == "__main__":
    main() 