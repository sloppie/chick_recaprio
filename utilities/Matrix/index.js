const IncompatibleMatrixError = require('../Errors/IncompatibleMatrixError').IncompatibleMatrixError;

class Matrix{
  /**
   * This constuctor takes in an array to repack it into a matrix stored in the object
   * @param {Array<Number>} arr  passed in as the array to be used as a Matrix during calculation
   * @param {Number} limit is the limit to the nuber of columns the user wants to be stored in the matrix
   */
  constructor(array, limit=null) {
    let arr = Matrix._matrixConverter(array);
    if(!limit) {
      this.matrix = arr;
      this.rows = this.matrix.length;
      this.columns = this.matrix[0].length;
    } else {
      this.matrix = new Array(arr.length);
      this.rows = arr.length;
      this.columns = limit;
      for(let i=0; i<arr.length; i++) {
        this.matrix[i] = arr[i].slice(0, limit);
      }
    }
  }

  static _matrixConverter(arr) {
    let newArr = [];
    if(typeof arr[0] == "number") {
      for(let i=0; i<arr.length; i++) {
        newArr.push([arr[i]]);
      }
    } else {
      newArr = arr;
    }

    console.log(JSON.stringify(newArr));
    return newArr;
  }

  /**
   * This static function compares two matrices and returns a Boolean corresponding to the answer
   * This may be used for matrix operations such as: Addition ```Matrix.add```and Subtraction ```Matrix.subtract```
   * 
   * @param { Matrix } matrix1 is the first of the two matrices being compared
   * @param { Matrix } matrix2 is the second of the two matrices being compared
   * 
   * @return ```Boolean``` true or false after comparing
   */
  static equals(matrix1, matrix2) {
    let equals = (matrix1.rows === matrix2.rows && matrix1.columns === matrix2.columns);
    if(equals) {
      console.log("Matrix are equal");
    } else {
      console.log("Not equal");
    }

    return equals;
  }

  /**
   * This is a private functiion that unwinds arrays into stacks to allow for manipulations irrespecctive of the number of dimensions
   * @param {Array} array this is the array that is to be unwound 
   * @param {Array} stack this is the stack that will contain the unwoundArray
   */
  static recurse(array, stack){
  }

  /**
   * This ```static``` function unwinds the arrays passed into it into a stack with the priority being observed:
   * ```
   *  Matrix.unwind([
   *    [2, 3, 4],
   *    [3, 4, 5],
   *  ]);
   * ```
   * 
   * @param {Array} matrixArray is an Array representationof the matrix in question
   * 
   * @return 2d array representing the Matrix in question irrespective of the number of dimensions
   */
  static unwind(matrixArray){
  }

  static repack(matrix){
  }

  /**
   * 
   * @param {Matrix} matrix is the matrix that is to be transposed
   * 
   * @returns {Matrix} transposedMatrix that is the transposed form of the parameter passed in 
   */
  static transpose(matrix){
    let newMatrix = new Array(matrix.columns);
    for(let i=0; i<newMatrix.length; i++) {
      newMatrix[i] = new Array(matrix.rows);
    }

    for(let i=0; i<matrix.rows; i++) {
      for(let j=0; j<matrix.columns; j++) {
          newMatrix[j][i] = matrix.matrix[i][j];
      }
    }

    return new Matrix(newMatrix);
  }

  /**
   * 
   * @param {Matrix} matrix is the matrix that is to be parsed into a string
   * 
   * @returns a string representing the Matrix in question 
   */
  static toString(matrix){
  }

  /**
   * parses the stringified object passed in as a Matrix 
   * @param {String} stringMatrix is a stringified representation of the Matrix to be parsed into a Matrix class
   * 
   * @return a new Matrix object that is a parsed form of the the passed in parameter
   */
  static parse(stringMatrix){
    let matrixObj = JSON.parse(stringMatrix);

    return new Matrix(matrixObj);
  }

  add(matrix2) {
    if(Matrix.equals(this, matrix2)) {
      for(let i=0; i<this.rows; i++) {
        for(let j=0; j<this.columns; j++) {
          this.matrix[i][j] += matrix2.matrix[i][j];
        }
      }
    }
  }

  subtract(matrix2){
    if(Matrix.equals(this, matrix2)) {
      for(let i=0; i<this.rows; i++) {
        for(let j=0; j<this.columns; j++) {
          this.matrix[i][j] -= matrix2.matrix[i][j];
        }
      }
    }
  }
  
  hadamardProduct(matrix2){
    if(Matrix.equals(this, matrix2)) {
      for(let i=0; i<this.rows; i++) {
        for(let j=0; j<this.columns; j++) {
          this.matrix[i][j] *= matrix2.matrix[i][j];
        }
      }
    }
  }

  multiply(matrix2) {
    let newMatrix = new Array(this.rows);
    for(let i=0; i<newMatrix.length; i++) {
      newMatrix[i] = new Array(matrix2.columns);
      for(let j=0; j<matrix2.columns; j++) {
        newMatrix[i][j] = 0;
      }
    }

    for(let i=0; i<this.rows; i++) {
      for(let j=0; j<matrix2.columns; j++) {
        for(let e=0; e<this.columns; e++) {
          newMatrix[i][j] += this.matrix[i][e] * matrix2.matrix[e][j];
        }
      }
    }

    return new Matrix(newMatrix);
  }

  scalarMultiply(scalar){
    for(let i=0; i<this.rows; i++) {
      for(let j=0; j<this.columns; j++) {
        this.matrix[i][j] *= scalar;
      }
    }
  }

  _forEach(...args){
  }
}


module.exports = {
  Matrix,
};