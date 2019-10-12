const IncompatibleMatrixError = require('./IncompatibleMatrixError.js').IncompatibleMatrixError;

class Matrix{
  /**
   * This constuctor takes in an array to repack it into a matrix stored in the object
   * @param {Array} arr  passed in as the array to be used as a Matrix during calculation
   */
  constructor(arr){
    if(arr instanceof Array){
        this.matrix = Matrix.unwind(arr);
        this.dimensions = [];
        let currentObject = arr;

        while(currentObject instanceof Array){
          this.dimensions.push(currentObject.length);
          currentObject = (currentObject[0] instanceof Array)? currentObject[0]: null;
        }
    }else if(arr instanceof Object){
      // Helps parse a string Matrix stored as a file... Used with the ```static Matrix.parse``` method
      this.matrix = arr.matrix;
      this.dimensions = arr.dimensions;
    }
  }

  /**
   * This static function compares two matrices and returns a Boolean corresponding to the answer
   * This may be used for matrix operations such as: Addition ```Matrix.add```and Subtraction ```Matrix.subtract```
   * 
   * @param matrix1 is the first of the two matrices being compared
   * @param matrix2 is the second of the two matrices being compared
   * 
   * @return ```Boolean``` true or false after comparing
   */
  static equals(matrix1, matrix2){
    if(matrix1 instanceof Matrix && matrix2 instanceof Matrix){
      if(matrix1.dimensions === matrix2.dimensions){
        return true;
      }
    }
    return false;
  }

  /**
   * This is a private functiion that unwinds arrays into stacks to allow for manipulations irrespecctive of the number of dimensions
   * @param {Array} array this is the array that is to be unwound 
   * @param {Array} stack this is the stack that will contain the unwoundArray
   */
  static recurse(array, stack){
    array.forEach((value)=>{
      if(value instanceof Array && value[0] instanceof Array){
        Matrix._recurse(value, stack);
      }else{
        stack[stack.length] = value;
      }
    });
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
    let stack;

    /**
     * This method unwinds the array into a single dimensional Matrix
     * @param {Array} array is the array representation of the Matrix in question
     * @param {Array} stack stack which stores each most inner level array individually
     */
    function recurse(array, stack){
      if(array.every(member => member instanceof Array)){
        array.forEach(child => {
          recurse(child, stack);
        });
      }else{
        stack.push(array);
      }
    }

    stack  = new Array();

    recurse(matrixArray, stack);

    return stack;
  }

  static repack(matrix){
    let dimensions = [...matrix.dimensions];

    for(let i of dimensions){
      // console.log(i);
    }
  }

  /**
   * 
   * @param {Matrix} matrix is the matrix that is to be transposed
   * 
   * @returns {Matrix} transposedMatrix that is the transposed form of the parameter passed in 
   */
  static transpose(matrix){
    let transposedMatrix = [];

    for(let i=0; i<matrix.matrix[0].length; i++){
      transposedMatrix[i] = [];
      for(let x=0; x<matrix.matrix.length; x++){
        transposedMatrix[i][x] = matrix.matrix[x][i];
      }
    }

    // console.log(transposedMatrix);
    return new Matrix(transposedMatrix);
  }

  /**
   * 
   * @param {Matrix} matrix is the matrix that is to be parsed into a string
   * 
   * @returns a string representing the Matrix in question 
   */
  static toString(matrix){
    let stringMatrix = {};

    stringMatrix.matrix = [...matrix.matrix];
    stringMatrix.dimensions = [...matrix.dimensions];

    return JSON.stringify(stringMatrix);
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
  // Matrix Operatons
  add(matrix2){
    // this._forEach(2, 3, 4);
    if(Matrix.equals(this, matrix2)){
      for(let i=0; i<this.matrix.length; i++){
        for(let j=0; j<this.matrix[i].length; j++){
          this.matrix[i][j] += matrix2.matrix[i][j];
        }
      }
    }
  }

  subtract(matrix2){
    if(Matrix.equals(this, matrix2)){
      for(let i=0; i<this.matrix.length; i++){
        for(let j=0; j<this.matrix[i].length; j++){
          this.matrix[i][j] -= matrix2.matrix[i][j];
        }
      }
    }
  }
  
  hadamardProduct(matrix2){
    if(Matrix.equals(this, matrix2)){
      for(let i=0; i<this.matrix.length; i++){
        for(let j=0; j<this.matrix[i].length; j++){
          this.matrix[i][j] *= matrix2.matrix[i][j];
        }
      }
    }
  }

  multiply(matrix2){
    if(this.matrix[0].length == matrix2.matrix.length){
      let results = [];
      for(let i=0; i<matrix2.matrix[0].length; i++){
        for(let x=0; x<this.matrix.length; x++){
          if(!(results[x] instanceof Array)){
            results[x] = new Array(matrix2.matrix[0].length);
          }
          let sumProduct = 0;
          for(let y=0; y<this.matrix[0].length; y++){
            sumProduct += this.matrix[x][y] * matrix2.matrix[y][i];
          }

          results[x][i] = sumProduct;
        }
      }

      console.log(results);
    }else{
      throw new IncompatibleMatrixError();
    }

  }

  scalarMultiply(scalar){
    if(Matrix.equals(this, matrix2)){
      for(let i=0; i<this.matrix.length; i++){
        for(let j=0; j<this.matrix[i].length; j++){
          this.matrix[i][j] *= scalar;
        }
      }
    }
  }

  _forEach(...args){
    let dimensions = [...this.dimensions];
    for(let i=0; i<this.matrix.length; i++){

    }
  }
}


module.exports = {
  Matrix,
};