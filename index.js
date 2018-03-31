function init() {

	function fitToContainer(c) {
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
	}

	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	fitToContainer(canvas);

	// $('#myCanvas').attr("width", $(window).width());
	$('#myCanvas').attr("height", $(window).height() - ($(window).height() * .25));

	$('#myCanvas').attr("class", "bg-dark");

	ctx.moveTo(0, 00);
	ctx.lineTo(20, 100, 0);

	ctx.strokeStyle = "#FF0000";
	ctx.stroke();
}

init();
