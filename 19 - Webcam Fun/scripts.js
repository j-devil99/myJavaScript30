const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
	navigator.mediaDevices
		.getUserMedia({ video: true, audio: false })
		.then((localMediaStream) => {
			console.log(localMediaStream);
			// video.src = window.URL.createObjectURL(localMediaStream);
			video.srcObject = localMediaStream;
			video.play();
		})
		.catch((err) => {
			console.error(`HELL NAWW`, err);
		});
}

function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;

	console.log(video.videoWidth);
	console.log(height);

	setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);
		let pixels = ctx.getImageData(0, 0, width, height);
		console.log(pixels);
		// pixels = redEffect(pixels);
		// pixels = rgbSplit(pixels);
		pixels = greenScreen(pixels);

		ctx.putImageData(pixels, 0, 0);
	}, 16);
}

function takePhoto() {
	snap.currentTime = 0;
	snap.play();

	const data = canvas.toDataURL("image/jpeg");
	const link = document.createElement("a");
	link.href = data;
	link.setAttribute("download", "awkward");
	link.textContent = "Download Image";
	link.innerHTML = `<img src='${data}' alt='Awkward Man'/>`;
	strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
	for (let index = 0; index < pixels.data.length; index += 4) {
		pixels.data[index] += 150;
		pixels.data[index + 1] -= 30;
		pixels.data[index + 2] -= 50;
	}
	return pixels;
}

function rgbSplit(pixels) {
	for (let index = 0; index < pixels.data.length; index += 4) {
		pixels.data[index + 500] = pixels.data[index];
		pixels.data[index + 500] = pixels.data[index + 1];
		pixels.data[index - 500] = pixels.data[index + 2];
	}
	return pixels;
}

function greenScreen(pixels) {
	const levels = {};

	document.querySelectorAll(".rgb input").forEach((input) => {
		levels[input.name] = input.value;
	});

	for (i = 0; i < pixels.data.length; i = i + 4) {
		red = pixels.data[i + 0];
		green = pixels.data[i + 1];
		blue = pixels.data[i + 2];
		alpha = pixels.data[i + 3];

		if (
			red >= levels.rmin &&
			green >= levels.gmin &&
			blue >= levels.bmin &&
			red <= levels.rmax &&
			green <= levels.gmax &&
			blue <= levels.bmax
		) {
			// take it out!
			pixels.data[i + 3] = 0;
		}
	}

	return pixels;
}

getVideo();
video.addEventListener("canplay", paintToCanvas);
