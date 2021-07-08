onmessage = function (msg) {
  console.log("Worker: Message received from main script");
  console.log(msg.data);
  switch (msg.data[0]) {
    case "gaussian":
      postMessage(gaussian_filter(msg.data[1], msg.data[2], msg.data[3]));
      break;
    case "uniform":
      postMessage(uniform_filter(msg.data[1], msg.data[2]));
      break;
    case "laplace":
      postMessage(laplace(msg.data[1]));
      break;
    case "sobel":
      postMessage(sobel(msg.data[1]));
      break;
    case "min":
      postMessage(sortFilter(msg.data[1], "min", msg.data[2]));
      break;
    case "med":
      postMessage(sortFilter(msg.data[1], "med", msg.data[2]));
      break;
    case "max":
      postMessage(sortFilter(msg.data[1], "max", msg.data[2]));
      break;
    default:
      break;
  }
  console.log("Worker: Posting message back to main script");
  // postMessage(workerResult);
};

/**
 * Turn image to a grayscale image.
 * @param {ImageData} imageData
 * @returns
 */
function grayscale(imageData) {
  let newImageData = new ImageData(imageData.width, imageData.height);
  for (let i = 0; i < newImageData.data.length; i += 4) {
    let avg =
      (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    newImageData.data[i] = avg;
    newImageData.data[i + 1] = avg;
    newImageData.data[i + 2] = avg;
    newImageData.data[i + 3] = imageData.data[i + 3];
  }
  return newImageData;
}
/**
 * Invert image color.
 * @param {ImageData} imageData
 * @returns {ImageData}
 */
function invert(imageData) {
  let newImageData = new ImageData(imageData.width, imageData.height);
  for (let i = 0; i < newImageData.data.length; i += 4) {
    newImageData.data[i] = 255 - imageData.data[i];
    newImageData.data[i + 1] = 255 - imageData.data[i + 1];
    newImageData.data[i + 2] = 255 - imageData.data[i + 2];
    newImageData.data[i + 3] = imageData.data[i + 3];
  }
  return newImageData;
}
/**
 * Image quantification.
 * @param {ImageData} imageData
 * @param {Number} q
 * @returns
 */
function quantify(imageData, q) {
  let newImageData = new ImageData(imageData.width, imageData.height);
  for (let i = 0; i < newImageData.data.length; i += 4) {
    newImageData.data[i] = Math.floor(imageData.data[i] / q) * q;
    newImageData.data[i + 1] = Math.floor(imageData.data[i + 1] / q) * q;
    newImageData.data[i + 2] = Math.floor(imageData.data[i + 2] / q) * q;
    newImageData.data[i + 3] = imageData.data[i + 3];
  }
  return newImageData;
}
/**
 * gaussian filter.
 * @param {ImageData} imageData
 * @param {Number} sigma the sigma of Math.E ** -(x ** 2 + y ** 2) / (2 * sigma ** 2)
 * @param {Number} size the size of the kernel(square).
 * @returns
 */
function gaussian_filter(imageData, sigma = 2, size = 3) {
  let kernel = [];
  let kSigma = Math.round(sigma / 2);
  for (let i = 0; i < size; i++) {
    kernel[i] = [];
    for (let j = 0; j < size; j++) {
      let x = i - kSigma;
      let y = j - kSigma;
      kernel[i][j] = Math.E ** (-(x ** 2 + y ** 2) / (2 * sigma ** 2));
    }
  }
  let sum = 0;
  for (let i = 0; i < kernel.length; i++) {
    for (let j = 0; j < kernel[0].length; j++) {
      sum += kernel[i][j];
    }
  }
  for (let i = 0; i < kernel.length; i++) {
    for (let j = 0; j < kernel[0].length; j++) {
      kernel[i][j] /= sum;
    }
  }
  return conv_imageData(imageData, kernel);
}
/**
 * uniform filter.
 * @param {ImageData} imageData
 * @param {Number} size the size of the kernel(square).
 * @returns
 */
function uniform_filter(imageData, size = 3) {
  kernel = [];
  let v = 1 / size / size;
  for (let i = 0; i < size; i++) {
    kernel[i] = [];
    for (let j = 0; j < size; j++) {
      kernel[i][j] = v;
    }
  }
  return conv_imageData(imageData, kernel);
}
/**
 * laplace.
 * @param {ImageData} imageData
 * @returns
 */
function laplace(imageData) {
  kernel = [
    [0, -1, 0],
    [-1, 4, -1],
    [0, -1, 0],
  ];
  return conv_imageData(imageData, kernel);
}
/**
 *
 * @param {ImageData} imageData
 * @param {Number} axis
 * @returns
 */
function sobel(imageData, axis = "x") {
  let kernel = {
    x: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ],
    y: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
  };

  return conv_imageData(imageData, kernel[axis]);
}
/**
 * Image convolution.
 * @param {ImageData} imageData
 * @param {Array<Number>} kernel 2D Array
 */
function conv_imageData(imageData, kernel) {
  let newImageData = new ImageData(imageData.width, imageData.height);
  let iHeight = imageData.height;
  let iWidth = imageData.width;
  let kRows = kernel.length;
  let kCols = kernel[0].length;
  let kCenterX = Math.floor(kCols / 2);
  let kCenterY = Math.floor(kRows / 2);
  for (let i = 0; i < iHeight; i++) {
    for (let j = 0; j < iWidth; j++) {
      newImageData.data[(i * iWidth + j) * 4 + 3] =
        imageData.data[(i * iWidth + j) * 4 + 3];
      let a = [0, 0, 0]; // ImageData.data is Uint8ClampedArray
      for (let m = 0; m < kRows; m++) {
        for (let n = 0; n < kCols; n++) {
          let ii = i + (m - kCenterY);
          let jj = j + (n - kCenterX);
          if (ii >= 0 && ii < iHeight && jj >= 0 && jj < iWidth) {
            a[0] += imageData.data[(ii * iWidth + jj) * 4 + 0] * kernel[m][n];
            a[1] += imageData.data[(ii * iWidth + jj) * 4 + 1] * kernel[m][n];
            a[2] += imageData.data[(ii * iWidth + jj) * 4 + 2] * kernel[m][n];
          }
        }
      }
      newImageData.data[(i * iWidth + j) * 4 + 0] = a[0];
      newImageData.data[(i * iWidth + j) * 4 + 1] = a[1];
      newImageData.data[(i * iWidth + j) * 4 + 2] = a[2];
    }
  }
  return newImageData;
}
/**
 *
 * @param {ImageData} imageData
 * @param {String} p the value of the sorted field.
 * @param {Number} size the size of the kernel(square).
 * @returns
 */
function sortFilter(imageData, p = "min", size = 3) {
  let newImageData = new ImageData(imageData.width, imageData.height);
  let iHeight = imageData.height;
  let iWidth = imageData.width;
  let kRows = size;
  let kCols = size;
  let kCenterX = Math.floor(size / 2);
  let kCenterY = Math.floor(size / 2);
  for (let i = 0; i < iHeight; i++) {
    for (let j = 0; j < iWidth; j++) {
      newImageData.data[(i * iWidth + j) * 4 + 3] =
        imageData.data[(i * iWidth + j) * 4 + 3];
      let a = [[], [], []]; // ImageData.data is Uint8ClampedArray
      for (let m = 0; m < kRows; m++) {
        for (let n = 0; n < kCols; n++) {
          let ii = i + (m - kCenterY);
          let jj = j + (n - kCenterX);
          if (ii >= 0 && ii < iHeight && jj >= 0 && jj < iWidth) {
            a[0].push(imageData.data[(ii * iWidth + jj) * 4 + 0]);
            a[1].push(imageData.data[(ii * iWidth + jj) * 4 + 1]);
            a[2].push(imageData.data[(ii * iWidth + jj) * 4 + 2]);
          }
        }
      }
      a.forEach((e) => e.sort((a, b) => a - b));
      let pos = 0; //最小值
      if (p === "max") {
        pos = a.length - 1;
      } else if (p === "med") {
        pos = Math.floor(a.length / 2);
      } else if (p === "min") {
        pos = 0;
      }
      newImageData.data[(i * iWidth + j) * 4 + 0] = a[0][pos];
      newImageData.data[(i * iWidth + j) * 4 + 1] = a[1][pos];
      newImageData.data[(i * iWidth + j) * 4 + 2] = a[2][pos];
    }
  }
  return newImageData;
}
/**
 * Turn imageData to an 2D array
 * @param {ImageData} imageData
 * @returns
 */
function imageData2Array(imageData) {
  let ia = [];
  let iHeight = imageData.height;
  let iWidth = imageData.width;
  for (let i = 0; i < iWidth; i++) {
    ia[i] = [];
    for (let j = 0; j < iHeight; j++) {
      ia[i][j] = [
        imageData.data[(j * iWidth + i) * 4 + 0],
        imageData.data[(j * iWidth + i) * 4 + 1],
        imageData.data[(j * iWidth + i) * 4 + 2],
        imageData.data[(j * iWidth + i) * 4 + 3],
      ];
    }
  }
  return ia;
}
