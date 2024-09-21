import os
import importlib
from flask import Flask, Blueprint

app = Flask(__name__)

blueprints_folder = os.path.join(os.path.dirname(__file__), 'custom', 'apis')

for filename in os.listdir(blueprints_folder):
    if filename.endswith('.py') and filename != '__init__.py':
        module_name = filename[:-3]
        # Importación relativa ajustada
        module = importlib.import_module(f'.custom.apis.{module_name}', package=__package__)
        for attribute_name in dir(module):
            attribute = getattr(module, attribute_name)
            if isinstance(attribute, Blueprint):
                app.register_blueprint(attribute)