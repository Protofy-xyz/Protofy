from setuptools import setup, find_packages

setup(
    name="protofy",
    version="0.1.3",
    packages=find_packages(),
    install_requires=[
        "paho-mqtt>=2.1.0", 
        "requests>=2.32.3"
    ],
)