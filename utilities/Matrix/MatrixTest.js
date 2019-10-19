const Matrix = require('./index.js').Matrix;
const eggs = require('../../data/eggs.json');

// [nE, bE, sE, lE]
let findTotals = (eggs, prices) => {
  let total = null;
  let weekNormaliser = new Matrix([
    [1],
    [1],
    [1],
    [1],
    [1],
    [1],
    [1]
  ]);

  let price = Matrix.transpose(new Matrix([prices]));
  
  for(let i=0; i<eggs.length; i++) {
    if (eggs[i]) {
      if (total) {
        let day = new Matrix(eggs[i], 4);
        total.add(day);
      } else {
        total = new Matrix(eggs[i], 4);
      }
    }
  }

  // show totals
  total = Matrix.transpose(total);
  total = total.multiply(weekNormaliser);
  total.scalarMultiply(1/30);
  let finance = total.multiply(price);
  finance = Matrix.transpose(finance).multiply(new Matrix([[1], [1], [1], [1]]));

  return finance;
}

findTotals(eggs, [270, 200, 240, 300]);
