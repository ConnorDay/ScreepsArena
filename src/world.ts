import { Flag } from "arena";
import { Creep, StructureTower } from "game/prototypes"
import { getObjectsByPrototype } from "game/utils";


class worldClass{
    allies: Creep[] = [];
    enemies: Creep[] = [];
    myTowers: StructureTower[] = [];
    enemyTowers: StructureTower[] = [];
    myFlag: Flag | undefined;
    enemyFlag: Flag | undefined;
}

const World = new worldClass();
export {World};