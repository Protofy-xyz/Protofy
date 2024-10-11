import os
import importlib
import json
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

@app.route('/pyapi/v1/endpoints')
def url_map():
    # Extract all the endpoints from the app
    url_map_serializable = []
    
    for rule in app.url_map.iter_rules():
        url_map_serializable.append({
            'function': rule.endpoint,
            'methods': list(rule.methods),
            'path': rule.rule
        })
    
    # Send it as a JSON
    return json.dumps(url_map_serializable)