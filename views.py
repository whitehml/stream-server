from flask import Blueprint, request, redirect, url_for, render_template
import datetime

views = Blueprint(__name__, "views")

@views.route("/")
def index():
	return redirect(url_for("views.stream"))

@views.route("/stream")
def stream():
	if request.method == "GET":
		powerData = [
			(-34, 13),
			(-20, 15),
		]
		#now = datetime.datetime.now()
		voltageData = [
			("2023-08-21 02:06:12.491089", 10.04),
			("2023-08-21 09:09:12.491089", 10.50),
			("2023-08-21 16:16:12.491089", 10.70),
			("2023-08-21 23:23:12.491089", 10.54),
		#	("2023-08-22 11:11:12.491089", 10.72),
		#	("2023-08-22 19:19:12.491089", 11.03),
		#	("2023-08-22 21:21:12.491089", 11.8),
		#	("2023-08-23 04:04:57.491089", 12.45),
		#	("2023-08-23 09:09:22.491089", 13.01),
		#	("2023-08-23 15:15:12.491089", 13.24),
		#	("2023-08-23 21:21:43.491089", 13.87),
		]

		power_time = [row[0] for row in powerData]
		power_value = [row[1] for row in powerData]
		
		return render_template("stream.html", voltage_data = [{'x' : row[0], 'y': row[1]} for row in voltageData], power_data = (power_time, power_value))
	if request.method == "POST":
		# Change display to connecting
		# Connect to bluetooth device
		# Then display temperature
		return render_template("stream.html")
