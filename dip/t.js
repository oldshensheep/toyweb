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

function uniform_array(len, value) {
  let arr = new Array(len);
  for (let i = 0; i < len; ++i)
    arr[i] = Array.isArray(value) ? [...value] : value;
  return arr;
}

function conv_2d(array, kernel) {
  let result = uniform_array(array.length, uniform_array(array[0].length, 0));
  let kRows = kernel.length;
  let kCols = kernel[0].length;
  let rows = array.length;
  let cols = array[0].length;
  let kCenterX = Math.floor(kCols / 2);
  let kCenterY = Math.floor(kRows / 2);
  let i, j, m, n, ii, jj;

  for (i = 0; i < rows; ++i) {
    for (j = 0; j < cols; ++j) {
      for (m = 0; m < kRows; ++m) {
        for (n = 0; n < kCols; ++n) {
          ii = i + (m - kCenterY);
          jj = j + (n - kCenterX);
          if (ii >= 0 && ii < rows && jj >= 0 && jj < cols) {
            result[i][j] += array[ii][jj] * kernel[m][n];
          }
        }
      }
    }
  }
  return result;
}

function unflatten(imageU8CA, w, h) {
  let ia = [];
  for (let i = 0; i < w; i++) {
    ia[i] = [];
    for (let j = 0; j < h; j++) {
      ia[i][j] = [
        imageU8CA[i * j + 0],
        imageU8CA[i * j + 1],
        imageU8CA[i * j + 2],
        imageU8CA[i * j + 3],
      ];
    }
  }
  return ia;
}

function flatten(image) {
  return null;
}

// let a = [
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
// ];

// let b = [
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 0],
// ];

// conv_2d(b, a).forEach((row) => console.log(row.join(" ")));

