import protopy

username = "admin@admin.com"
password = "adminadmin"
session = protopy.auth.login(host="localhost:3002", username=username, password=password, secure_connection=False)
token = protopy.auth.getToken(session)
protopy.events.pubEvent(host="localhost:3002", token=token, event={
    "ephemeral": False,
    "environment": 'dev',
    "path": "test/event", 
    "from": "script",
    "user": username,
    "payload": {
        "message": "test",
    }    
}, secure_connection=False)