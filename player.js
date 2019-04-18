
class Player {
	
	constructor(name){
		this.name = name;
		this.room = "-1";
	}

	leaveRoom(){
		this.room = "-1";
	}


}

module.exports = Player;