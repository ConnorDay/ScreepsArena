import { Flag } from "arena";
import { Creep, StructureTower } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import { Tower } from "./tower";

class worldClass {
	allies: Creep[] = [];
	enemies: Creep[] = [];
	myTowers: Tower[] = [];
	enemyTowers: Tower[] = [];
	myStoredFlag: Flag | undefined;
	enemyStoredFlag: Flag | undefined;

	public get myFlag(): Flag {
		return this.myStoredFlag as Flag;
	}
	public get enemyFlag(): Flag {
		return this.enemyStoredFlag as Flag;
	}
}

const World = new worldClass();
export { World };
