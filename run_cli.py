#!/usr/bin/env python3
"""
CLI Wrapper for Agentic DevOps

This script provides a wrapper to run the CLI with proper import handling.
"""

import os
import sys
import importlib.util

def main():
    """Run the CLI with proper import handling."""
    # Add the project root to the Python path
    project_root = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, project_root)
    
    try:
        # Import the CLI module
        from agentic_devops.src import cli
        
        # Run the CLI
        sys.exit(cli.main())
    except ImportError as e:
        print(f"Error importing CLI module: {e}")
        print("Make sure you're running this script from the project root directory.")
        sys.exit(1)
    except Exception as e:
        print(f"Error running CLI: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()