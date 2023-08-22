from concurrent.futures import thread
from socket import socket
from flask import Flask
from views import views
from flask_socketio import SocketIO

from random import random
from threading import Lock
from datetime import datetime
thread = None
thread_lock = Lock()


app = Flask(__name__)
app.register_blueprint(views)

socketio = SocketIO(app)

def bg_thread():
	print("Faking Sensor values")
	prev_value = 10.8
	while True:
		fake_value = prev_value - round(random(), 3) + round(random() * 1.5, 3)
		socketio.emit('update', {'value': fake_value, "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")})
		print("emitted")
		socketio.sleep(1)

@socketio.on('connect')
def connect():
	print('Client connected')
	# await background task

	global thread
	with thread_lock:
		 if thread is None:
			 thread = socketio.start_background_task(bg_thread)

@socketio.on('disconnect')
def disconnect():
	print('Client disconnected')
	
if __name__ == '__main__':
	socketio.run(app, host ="0.0.0.0")