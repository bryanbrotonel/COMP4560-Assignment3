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

			function parseNodes(nodes, first, last) {

				for (var i = first; i < last; i++) {
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
						nodes.push(node);
					}
				}
			}

			parseNodes(lNodes, 210, 243);
			parseNodes(rNodes, 246, 279);

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

			function parseLines(edges) {

				for (var i = 1; i < allTextLines.length; i++) {
					var data = allTextLines[i].split(',');

					if (data.length == headers.length) {

						j = 0;

						var edge = [];

						var x = data[j++]
						var y = data[j++]

						edge.push(x, y)
						edges.push(edge)
					}
				}
			}

			parseLines(lEdges);
			parseLines(rEdges);

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

			processing.size(900, 700);
			processing.background(processing.color(0, 0, 0));

			processing.translate(processing.width / 2, processing.height / 2);

			if (vertexFile) {

				function drawNodes(nodes, colour) {
					// Draw nodes
					processing.fill(colour);
					processing.noStroke();
					for (var n = 0; n < nodes.length; n++) {
						var node = nodes[n];
						processing.ellipse(node[1], node[2], 5, 5);
					}
				}

				drawNodes(lNodes, processing.color(255, 0, 0));
				drawNodes(rNodes, processing.color(0, 0, 255));
			}

			if (edgeFile) {

				function drawEdges(nodes, edges, colour) {
					processing.stroke(colour);
					for (var e = 0; e < edges.length; e++) {

						var node0;
						var node1;

						for (var i = 0; i < nodes.length; i++) {
							if (nodes[i][0] == edges[e][0]) {
								node0 = nodes[i]
							}
						}

						for (var i = 0; i < nodes.length; i++) {
							if (nodes[i][0] == edges[e][1]) {
								node1 = nodes[i]
							}
						}
						processing.line(node0[1], node0[2], node1[1], node1[2]);
					}
				}

				drawEdges(lNodes, lEdges, processing.color(255, 0, 0));
				drawEdges(rNodes, rEdges, processing.color(0, 0, 255));
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
