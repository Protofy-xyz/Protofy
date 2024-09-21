import os
import subprocess
import sys
import time

venv_dir = os.path.join(os.path.dirname(__file__), '..','..','packages', 'app', '.venv')
requirements_file = os.path.join(os.path.dirname(__file__), '..', '..', 'requirements.txt')

def create_venv():
    # Determine the correct path to pip based on the OS
    if os.name == 'nt':
        pip_executable = os.path.join(venv_dir, 'Scripts', 'pip.exe')
    else:
        pip_executable = os.path.join(venv_dir, 'bin', 'pip')
    if not os.path.exists(venv_dir):
        print("Virtual environment not found. Creating a new one...")
        subprocess.run([sys.executable, '-m', 'venv', venv_dir])

        # Small pause to allow windows binaries to be created
        time.sleep(2)

        # Force install pip using ensurepip if pip is not found
        if not os.path.exists(pip_executable):
            print(f"{pip_executable} not found. Installing pip using ensurepip...")
            subprocess.run([os.path.join(venv_dir, 'Scripts', 'python.exe'), '-m', 'ensurepip'])
            subprocess.run([os.path.join(venv_dir, 'Scripts', 'python.exe'), '-m', 'pip', 'install', '--upgrade', 'pip'])

        # Verify if pip executable exists now
        if not os.path.exists(pip_executable):
            print(f"Error: {pip_executable} still not found after attempting installation.")
            sys.exit(1)

    # Install dependencies
    if os.path.exists(requirements_file):
        if not os.path.exists(pip_executable):
            print("Error: virtual environment is corrupted. remove the .venv directory and try again.")
            sys.exit(1)
        print("Installing dependencies from requirements.txt...")
        subprocess.run([pip_executable, 'install', '-r', requirements_file])
    else:
        print("requirements.txt not found. Please make sure it exists in the project root.")
        sys.exit(1)


if __name__ == "__main__":
    create_venv()