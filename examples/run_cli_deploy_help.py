#!/usr/bin/env python3
"""
Script to run the DevOps Agent CLI with deployment help command.
"""

import sys
import os

# Add the current directory to the path so we can import the module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the main function from the CLI module
from agentic_devops.src.cli import main

if __name__ == "__main__":
    # Set up arguments for deployment help command
    sys.argv = ["cli.py", "deploy", "--help"]
    # Run the CLI
    main()