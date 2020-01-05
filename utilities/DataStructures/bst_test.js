let BST = require("./BinarySearchTrees.js").BinarySearchTree;

let arr = [];

for(let i = 0; i<50; i++){
	let data = {weekNumber: Math.floor(Math.random() * 50)}; 
	arr.push(data);
}

let bst = new BST(arr[0]);

for(let i=1; i<50; i++){
	bst.add(arr[i]);
}

const store = new Array();

bst.visit(store);

console.log(store);

