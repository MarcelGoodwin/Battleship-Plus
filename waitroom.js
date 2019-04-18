const Player = require('./player.js')

class Waitroom{

	constructor(){
		this.name = this.generateRoomName()
		this.size = 0;
		this.maxsize = 4;
		this.players = [];
	}

	generateRoomName(){
		let r = Math.random().toString(36).substring(8);
		return r;
	}

	//add a player to the room
	addPlayer(player){
		if(this.size < this.maxsize){
			this.players.push(player);
		}
	}

	//called on game end
	clearRoom(){
		this.size = 0;
		this.players = [];
	}

	//returns the number of players in the room
	getsize(){
		return this.size;
	}
}

module.exports Waitroom;