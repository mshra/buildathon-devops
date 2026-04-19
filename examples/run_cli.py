#!/usr/bin/env python3
"""
Script to run the DevOps Agent CLI directly from the source code.
"""

import sys
import os

# Add the current directory to the path so we can import the module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the main function from the CLI module
from agentic_devops.src.cli import main

if __name__ == "__main__":
    # Run the CLI with the provided arguments
    main()