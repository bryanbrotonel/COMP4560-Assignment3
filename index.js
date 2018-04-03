window.onload = function() {

	var vertexFileInput = document.getElementById("vertexFileInput")
	var linesFileInput = document.getElementById("linesFileInput")
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	var vertexFile = false;
	var edgeFile = false;

	var rNodes = [];
	var rEdges = [];

	var lNodes = [];
	var lEdges = [];

	var pxTomm = function(px) {
		return Math.floor(px / $('#my_mm').height()); //JQuery returns sizes in PX
	};

	console.log(pxTomm(3.779528))

	function readVertexFile() {
		var reader = new FileReader();

		reader.onload = function() {
			var allTextLines = (reader.result).split(/\r\n|\n/);
			var headers = allTextLines[245].split(',');

			console.log(headers)

			for (var i = 210; i < 243; i++) {
				var data = allTextLines[i].split(',');

				if (data.length == headers.length) {

					j = 0;

					var point = data[j++]
					var u = parseFloat(data[j++])
					var v = parseFloat(data[j++])
					var n = parseFloat(data[j++])
					var h = parseFloat(data[j++])

					var node = [];
					node.push(point.toLowerCase(), u * 3.779528, -v * 3.779528, n);
					lNodes.push(node);
				}
			}

			for (var i = 246; i < 279; i++) {
				var data = allTextLines[i].split(',');

				if (data.length == headers.length) {

					j = 0;

					var point = data[j++]
					var u = parseFloat(data[j++])
					var v = parseFloat(data[j++])
					var n = parseFloat(data[j++])
					var h = parseFloat(data[j++])

					var node = [];
					node.push(point.toLowerCase(), u * 3.779528, -v * 3.779528, n);
					rNodes.push(node);
				}
			}

			vertexFile = true;

			console.log(lNodes);
			console.log(rNodes);

		};
		// start reading the file. When it is done, calls the onload event defined above.
		reader.readAsBinaryString(vertexFileInput.files[0]);
	};

	function readLinesFile() {
		var reader = new FileReader();

		reader.onload = function() {
			var allTextLines = (reader.result).split(/\r\n|\n/);
			var headers = allTextLines[0].split(',');

			for (var i = 1; i < allTextLines.length; i++) {
				var data = allTextLines[i].split(',');

				if (data.length == headers.length) {

					j = 1;

					var edge = [];

					var x = data[j++]
					var y = data[j++]

					edge.push(x, y)
					lEdges.push(edge)
				}
			}

			for (var i = 1; i < allTextLines.length; i++) {
				var data = allTextLines[i].split(',');

				if (data.length == headers.length) {

					j = 1;

					var edge = [];

					var x = data[j++]
					var y = data[j++]

					edge.push(x, y)
					rEdges.push(edge)
				}
			}

			edgeFile = true;
			console.log(lEdges)
			console.log(rEdges)

		};
		// start reading the file. When it is done, calls the onload event defined above.
		reader.readAsBinaryString(linesFileInput.files[0]);
	};

	vertexFileInput.addEventListener('change', readVertexFile);
	linesFileInput.addEventListener('change', readLinesFile);

	function sketchProc(processing) {
		// Override draw function, by default it will be called 60 times per second
		processing.draw = function() {
			var backgroundColour = processing.color(0, 0, 0);

			processing.size(900, 700);
			processing.background(backgroundColour);

			var centerX = processing.width / 2,
				centerY = processing.height / 2;

			processing.translate(centerX, centerY);

			if (vertexFile) {

				// LR
				var nodeColour = processing.color(255, 0, 0);

				// Draw nodes
				processing.fill(nodeColour);
				processing.noStroke();
				for (var n = 0; n < lNodes.length; n++) {
					var node = lNodes[n];
					processing.ellipse(node[1], node[2], 5, 5);
				}

				// PR
				var nodeColour = processing.color(0, 0, 255);

				// Draw nodes
				processing.fill(nodeColour);
				processing.noStroke();
				for (var n = 0; n < rNodes.length; n++) {
					var node = rNodes[n];
					processing.ellipse(node[1], node[2], 5, 5);
				};

			}

			if (edgeFile) {

				// LR
				var edgeColour = processing.color(255, 0, 0);

				// Draw edges
				processing.stroke(edgeColour);
				for (var e = 0; e < lEdges.length; e++) {

					var node0;
					var node1;

					for (var i = 0; i < lNodes.length; i++) {
						if (lNodes[i][0] == lEdges[e][0]) {
							node0 = lNodes[i]
						}
					}

					for (var i = 0; i < lNodes.length; i++) {
						if (lNodes[i][0] == lEdges[e][1]) {
							node1 = lNodes[i]
						}
					}

					processing.line(node0[1], node0[2], node1[1], node1[2]);
				}


				// PR
				var edgeColour = processing.color(0, 0, 255);

				// Draw edges
				processing.stroke(edgeColour);
				for (var e = 0; e < rEdges.length; e++) {

					var node0;
					var node1;

					for (var i = 0; i < rNodes.length; i++) {
						if (rNodes[i][0] == rEdges[e][0]) {
							node0 = rNodes[i]
						}
					}

					for (var i = 0; i < rNodes.length; i++) {
						if (rNodes[i][0] == rEdges[e][1]) {
							node1 = rNodes[i]
						}
					}

					processing.line(node0[1], node0[2], node1[1], node1[2]);
				}
			}

		};
	}

	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;

	// attaching the sketchProc function to the canvas
	var processingInstance = new Processing(canvas, sketchProc);
}
