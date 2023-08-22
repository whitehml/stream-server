// Chart initialization
var voltage_graph;
var power_graph;

const TIMESCALE_H = 72;
Chart.defaults.font.size = 26;
Chart.defaults.borderColor = "#4f4f4f";


function initVoltageGraph(voltage_data) {
	let ctx = document.getElementById("voltage-graph").getContext("2d");
	ctx.canvas.width  = window.innerWidth;
	voltage_graph = new Chart(ctx, {
	type: "scatter",
	data: {
	datasets: [{
		data: voltage_data,
		//fill: true,
	}]
	},
	options: {
		plugins: {
			title: {
				display: true,
				padding: 15,
				text: "Voltage",
				color: "white",
				font: {
					size: 48,
				},
			},
			legend: {
				display: false,
			}
		},
		scales: {
			y: {
				min: 8,
				max: 18,
				ticks: {
					color: "white",
					callback: function(value, index) {
						if (index != 0) {
							return `${value} V`;
						}
						return undefined;
					},
				},
			},
			x: {
				type: "time",
				time: {
					unit: 'hour',
				},
				min: moment(voltage_data[voltage_data.length - 1]['x']).add(-TIMESCALE_H, 'h').format(),
				ticks: {
					padding: 5,
					color: "white",
					minRotation: 45,
					callback: function(value, index) {
                        var tick;
						const hour = moment(value).hour();

						if (hour === 0) {
							tick = moment(value).format('ddd')
						}
						if(tick === undefined && hour != 1 && hour != 23)  {
							tick = index % 3 === 0 ? moment(value).format('h A'): undefined;
						}
						// if (t === undefined) {
						// 	console.log(moment(value).format('h A'));
						// 	console.log(moment(value).hour());
						// }
						return tick;
                    },
				},
			}
		},
		showLine: true,
		maintainAspectRatio: false,
	}
	});
}

function initPowerGraph(power_data) {
	let ctx = document.getElementById("power-graph").getContext("2d");
	power_graph = new Chart(ctx, {
		type: "scatter",
		data: {
		labels: power_data[0],
		datasets: [{
			label: "Power",
			data: power_data[1],
		}],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: "Power",
					fontColor: "white",
				}
			},
			scales: {
				y: {
					min: 0,
					max: 20,
				},
				x: {
					min: -36,
					max: 36,
					ticks: {
						//display: false,
					},
				}
			},
			showLine: true,
			maintainAspectRatio: false,
		}
	});
}

function addVoltageData(data) {
	voltage_graph.data.datasets.forEach((dataset) => {
	dataset.data.push(data);
	});
	voltage_graph.options.scales.x.min = moment(data.x).add(-60, 's').format()
	voltage_graph.update();
}

function removeFirstVoltageData() {
	voltage_graph.data.datasets.forEach((dataset) => {
	dataset.data.shift();
	});
}

const socket = io.connect();
  
	const MAX_DATA_COUNT = 10;
  
	//receive details from server
	socket.on("update", function (msg) {
		let d = {
			x: msg.date,
			y: msg.value,
		}
	
		addVoltageData(d);
	});
  // });
  