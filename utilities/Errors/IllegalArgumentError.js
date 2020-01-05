class IllegalArgumentError extends Error{
  constructor(error){
    super(error);
    this.name = `IllegalArgumentError`;
    console.log(`${this.name}`);
  }
}


module.exports = {
  IllegalArgumentError,
};
