import { SpaceObject } from "./SpaceObject";

class Missle extends SpaceObject {
	constructor(objID, mass, fuel, target, effect) {
	  super(objID, mass); 
	}
  
	//TODO: add tracking and guidence
	//TODO: add AI to thrust toward target based on guidence
  }