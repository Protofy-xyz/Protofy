import requests
import re
import json
import sys

def pubEvent(host, token, event, secure_connection):
    protocol = "http" if secure_connection == False else "https"
    
    url =  protocol + "://" + host + "/adminapi/v1/events?token=" + token
    headers = {
        "content-type": "application/json",
    }
    body = json.dumps(event)
    body = re.sub(r'(?<!")(\w+)(?!"):', r'"\1":', body)
    print("[EVENT] info: ", body)
    sys.stdout.flush()

    try:
        # response = requests.post(url, json=body, headers=headers)
        response = requests.post(url,
                                 data=body, headers=headers)
        if (response.status_code != 200):
            print("[EVENT] Cannot post event to Protofy")
            print("  '- ", response.text)
            sys.stdout.flush()
            return

        print("[EVENT] Succesfully sent event to Protofy")
        sys.stdout.flush()

        return response.json()
    except Exception as e:
        print("[EVENT] Cannot send event to Protofy: ", e)
        sys.stdout.flush()
