
class IncompatibleMatrixError extends Error{
  constructor(){
    super("The two Matrices are incompatible thus no operation can be carried out on them");
    this.name = "IncompatibleMatrixError";
  }
}

module.exports = {
  IncompatibleMatrixError,
}