import requests
import sys

def login(host, username, password, secure_connection):
    try:
        protocol = "http" if secure_connection == "false" or secure_connection == False else "https"
        url =  protocol + "://" + host + "/adminapi/v1/auth/login"

        # Headers you want to send
        headers = {
            "content-type": "application/json",
        }

        # Body of the request (for JSON data)
        body = {
            'username': username,
            'password': password,
        }
    
        response = requests.post(url, json=body, headers=headers)
        if (response.status_code != 200):
            print("[AUTH] Cannot athenticate on Protofy")
            sys.stdout.flush()

            return

        print("[AUTH] Succesfully authenticated on Protofy")
        sys.stdout.flush()
        return response.json()
    except:
        print("[AUTH] Cannot connect to Protofy")
        sys.stdout.flush()


def getToken(session):
    # Access the 'token' from the 'session' dictionary
    token = session['session']['token']
    return token