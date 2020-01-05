
/**
 * The data to be stored is a JSON Object:
 * {
 *	 weekNumber: Number,
 * 	 ...
 *   ...,
 * } 
 */

class BinarySearchTree {
	constructor(head: Object){
		this.head = new Node(head);
	}

	add(data){
		this.head.addNode(data);
	}

	visit(store){
		this.head.visit(store);
	}
}

class Node {
	constructor(data){
		this.data = data;
		this.left = null;
		this.right = null;
	}

	addNode(dt){
		if(this.data.weekNumber >= dt.weekNumber){
			if(this.left != null){
				this.left.addNode(dt);
			}else{
				this.left = new Node(dt);
			}
		}else{
			if(this.right != null){
				this.right.addNode(dt);
			}else{
				this.right = new Node(dt);
			}
		}
	}

	visit(store){
		if(this.left != null){
			this.left.visit(store)
		}

		store.push(this.data);

		if(this.right != null){
			this.right.visit(store);
		}
	}	
}

module.exports = {
	BinarySearchTree,
};




