from flask import Blueprint

#blueprint with same name as the file
{{codeNameLowerCase}}_bp = Blueprint('{{codeNameLowerCase}}_bp', __name__)

@test_bp.route("/pyapi/v1/{{codeNameLowerCase}}")
def {{codeNameLowerCase}}_run():
    return "ok"