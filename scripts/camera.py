import cv2
from flask import Flask, Response
import threading

app = Flask(__name__)
latest_frame = None
lock = threading.Lock()

CAMERA_INDEX = 2  # OBS Virtual Camera
WIDTH = 896
HEIGHT = 896
JPEG_QUALITY = 95

def capture_loop():
    global latest_frame
    cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
    if not cap.isOpened():
        raise RuntimeError("❌ No se pudo abrir la cámara OBS Virtual")

    # Fuerza resolución cuadrada como la configurada en OBS
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, HEIGHT)

    while True:
        ret, frame = cap.read()
        if not ret:
            continue
        with lock:
            latest_frame = frame  # tal cual viene de OBS

@app.route('/obs.jpg')
def get_frame():
    with lock:
        if latest_frame is None:
            return "No frame yet", 503
        _, jpeg = cv2.imencode('.jpg', latest_frame, [int(cv2.IMWRITE_JPEG_QUALITY), JPEG_QUALITY])
        return Response(jpeg.tobytes(), mimetype='image/jpeg')

if __name__ == '__main__':
    print("🚀 Servidor en marcha en http://localhost:5000/obs.jpg")
    thread = threading.Thread(target=capture_loop, daemon=True)
    thread.start()
    app.run(host='0.0.0.0', port=5000)
