const Matrix = require('./Matrix.js').Matrix;

// Tests
let testArray = [
  // 1d
  [2, 3, 4],
  // 2d
  [
    [2, 3],
    [4, 5],
  ],
  //3d
  [
    [
      [2, 3, 4],
      [3, 4, 5]
    ]
  ]
];


// testArray.forEach((val)=>{
//   let test = new Matrix(val);
//   test.multiply(test);
//   test.toString();
//   Matrix.repack(test);
// });
let test = new Matrix(testArray[0]);

// test.multiply(test);

Matrix.toString(new Matrix(testArray[0]));
