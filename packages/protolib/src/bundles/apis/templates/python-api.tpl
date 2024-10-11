from flask import Blueprint, request, jsonify

#blueprint with same name as the file
{{codeNameLowerCase}}_bp = Blueprint('{{codeNameLowerCase}}_bp', __name__)

@{{codeNameLowerCase}}_bp.route("/pyapi/v1/automations/{{codeNameLowerCase}}")
def {{codeNameLowerCase}}_run():
    return jsonify("ok")