#!/usr/bin/env python3
"""
Simple script to check if the agents module is available.
"""

import sys
import os

print("Python version:", sys.version)
print("Python executable:", sys.executable)
print("Current working directory:", os.getcwd())
print("Python path:", sys.path)

try:
    import agents
    print("\nSuccessfully imported agents module")
    print("agents module location:", agents.__file__)
    
    try:
        from agents.types import RunContext
        print("Successfully imported RunContext from agents.types")
    except ImportError as e:
        print("Error importing RunContext from agents.types:", e)
        
except ImportError as e:
    print("\nError importing agents module:", e)
    print("\nTrying to find installed packages:")
    
    try:
        import pkg_resources
        installed_packages = [d.project_name for d in pkg_resources.working_set]
        print("Installed packages:", installed_packages)
        
        # Check for openai-agents specifically
        if 'openai-agents' in installed_packages:
            print("openai-agents is installed")
        else:
            print("openai-agents is NOT installed")
    except Exception as e:
        print("Error listing installed packages:", e)