import os
import subprocess
import sys

venv_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'packages', 'app', '.venv')

def start_jupyter():
    print("Starting Jupyter Lab...")
    if os.name == 'nt':
        jupyter_executable = os.path.join(venv_dir, 'Scripts', 'jupyter-lab.exe')
    else:
        jupyter_executable = os.path.join(venv_dir, 'bin', 'jupyter-lab')

    # Verify if Jupyter executable exists
    if not os.path.exists(jupyter_executable):
        print(f"Error: {jupyter_executable} not found.")
        sys.exit(1)

    subprocess.run([jupyter_executable, '--ip=0.0.0.0', '--port=8888', '--no-browser', '--notebook-dir=../../'])
    
if __name__ == "__main__":
    start_jupyter()
