console.log("first");
const editor = document.getElementById("editor");
const context = editor.getContext("2d");
const fileInput = document.getElementById("fileInput");
const save = document.getElementById("download");
const flipRight = document.getElementById("flipRight");
const flipLeft = document.getElementById("flipLeft");
const flipHorizontal = document.getElementById("flipHorizontal");
const flipVertical = document.getElementById("flipVertical");

// getting the image data from input and setting it to canvas
fileInput.addEventListener("change", function () {
	const maxWidth = editor.width;
	const maxHeight = editor.height;
	try {
		const file = this.files[0];
		if (file) {
			const img = new Image();
			img.onload = () => {
				let width = img.width;
				let height = img.height;

				const aspectRatio = width / height;

				if (width > maxWidth) {
					width = maxWidth;
					height = width / aspectRatio;
				}

				if (height > maxHeight) {
					height = maxHeight;
					width = height * aspectRatio;
				}
				context.clearRect(0, 0, editor.width, editor.height);
				context.drawImage(img, 0, 0, width, height);
				// context.drawImage(img, 0, 0);
			};
			img.onerror = () => {
				console.log("file format not supported");
			};
			img.src = URL.createObjectURL(this.files[0]);
		}
	} catch (error) {
		console.log(error.message);
	}
});

//download the formatted image
save.addEventListener("click", () => {
	const image = editor.toDataURL();
	const link = document.createElement("a");
	link.download = "image.png";
	link.href = image;
	link.click();
});

/* UTILITY FUNCTIONS */
//set the image data in canvas after doing actions
function setImageData(image, rows, cols) {
	const Image = Array.from({ length: rows * cols * 4 });
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			for (let k = 0; k < 4; k++) {
				Image[(i * cols + j) * 4 + k] = image[i][j][k];
			}
		}
	}
	const imageData = context.createImageData(cols, rows);
	imageData.data.set(Image);
	editor.width = cols;
	editor.height = rows;
	context.putImageData(imageData, 0, 0);
}

//Getting the 1d array of pixels
function getRGBArray(rows, cols) {
	let data = context.getImageData(0, 0, cols, rows).data;
	let RGBImage = [];
	for (let i = 0; i < rows; i++) {
		let row = [];
		for (let j = 0; j < cols; j++) {
			let pixel = [];
			for (let k = 0; k < 4; k++) {
				pixel.push(data[(i * cols + j) * 4 + k]);
			}
			row.push(pixel);
		}
		RGBImage.push(row);
	}
	return RGBImage;
}

//-----------------------------------------------------
//Edit actions:

/*ROTATE RIGHT START*/
flipRight.addEventListener("click", () => {
	let cols = editor.width;
	let rows = editor.height;
	let image = getRGBArray(rows, cols);

	let flippedImage = [];
	for (let i = 0; i < cols; i++) {
		let row = [];
		for (let j = rows - 1; j >= 0; j--) {
			row.push(image[j][i]);
		}
		flippedImage.push(row);
	}
	setImageData(flippedImage, cols, rows);
});
/*ROTATE RIGHT END */

/*ROTATE LEFT START*/
flipLeft.addEventListener("click", () => {
	let cols = editor.width;
	let rows = editor.height;
	let image = getRGBArray(rows, cols);

	let flippedImage = [];
	for (let i = cols - 1; i >= 0; i--) {
		let row = [];
		for (let j = 0; j < rows; j++) {
			row.push(image[j][i]);
		}
		flippedImage.push(row);
	}
	setImageData(flippedImage, cols, rows);
});
/*ROTATE LEFT END*/

/*ROTATE HORIZONTAL START */
flipHorizontal.addEventListener("click", () => {
	let cols = editor.width;
	let rows = editor.height;
	let image = getRGBArray(rows, cols);

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < Math.floor(cols / 2); j++) {
			let temp = image[i][j];
			image[i][j] = image[i][cols - 1 - j];
			image[i][cols - 1 - j] = temp;
		}
	}
	setImageData(image, rows, cols);
});
/*ROTATE HORIZONTAL END */

/*ROTATE VERTICAL START */
flipVertical.addEventListener("click", () => {
	let cols = editor.width;
	let rows = editor.height;
	let image = getRGBArray(rows, cols);

	for (let i = 0; i < Math.floor(rows / 2); i++) {
		for (let j = 0; j < cols; j++) {
			let temp = image[i][j];
			image[i][j] = image[rows - 1 - i][j];
			image[rows - 1 - i][j] = temp;
		}
	}
	setImageData(image, rows, cols);
});
/*ROTATE VERTICAL END */
