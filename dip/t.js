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
      for (let m = 0; m < kRows; m++) {
        for (let n = 0; n < kCols; n++) {
          let ii = i + (m - kCenterY);
          let jj = j + (n - kCenterX);
          if (ii >= 0 && ii < iHeight && jj >= 0 && jj < iWidth) {
            newImageData.data[(i * iWidth + j) * 4 + 0] +=
              imageData.data[(ii * iWidth + jj) * 4 + 0] * kernel[m][n];
            newImageData.data[(i * iWidth + j) * 4 + 1] +=
              imageData.data[(ii * iWidth + jj) * 4 + 1] * kernel[m][n];
            newImageData.data[(i * iWidth + j) * 4 + 2] +=
              imageData.data[(ii * iWidth + jj) * 4 + 2] * kernel[m][n];
          }
        }
      }
    }
  }
  return newImageData;
}
/**
 * Turn imageData to an 2D array
 * @param {ImageData} imageData
 * @returns
 */
function unflatten(imageData) {
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
