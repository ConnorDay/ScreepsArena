import { Flag } from "arena";
import { Creep, StructureTower } from "game/prototypes"
import { getObjectsByPrototype } from "game/utils";
import { Tower } from "./tower";


class worldClass{
    allies: Creep[] = [];
    enemies: Creep[] = [];
    myTowers: Tower[] = [];
    enemyTowers: Tower[] = [];
    myFlag: Flag | undefined;
    enemyFlag: Flag | undefined;
}

const World = new worldClass();
export {World};