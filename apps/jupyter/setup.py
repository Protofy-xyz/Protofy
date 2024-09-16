import os
import subprocess
import sys
import time

venv_dir = os.path.join(os.path.dirname(__file__), '.venv')
requirements_file = os.path.join(os.path.dirname(__file__), 'requirements.txt')

def create_venv():
    if not os.path.exists(venv_dir):
        print("Virtual environment not found. Creating a new one...")
        subprocess.run([sys.executable, '-m', 'venv', venv_dir])

        # Pausar para dar tiempo a que se configuren los binarios en Windows
        time.sleep(2)

        # Determine the correct path to pip based on the OS
        if os.name == 'nt':
            pip_executable = os.path.join(venv_dir, 'Scripts', 'pip.exe')
        else:
            pip_executable = os.path.join(venv_dir, 'bin', 'pip')

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
            print("Installing dependencies from requirements.txt...")
            subprocess.run([pip_executable, 'install', '-r', requirements_file])
        else:
            print("requirements.txt not found. Please make sure it exists in the project root.")
            sys.exit(1)
    else:
        print("Virtual environment already exists. Skipping creation.")

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

    subprocess.run([jupyter_executable, '--ip=0.0.0.0', '--port=8888', '--no-browser'])

if __name__ == "__main__":
    create_venv()
    start_jupyter()