import { Flag } from 'arena/prototypes';
import { Creep, StructureTower } from 'game/prototypes';
import { getObjectsByPrototype } from 'game/utils';
import {World} from './world';

export function init(){
    const creeps = getObjectsByPrototype(Creep);
    World.allies = creeps.filter((c) => c.my);
    World.enemies = creeps.filter((c) => !c.my);

    const towers = getObjectsByPrototype(StructureTower);
    World.myTowers = towers.filter((t) => t.my);
    World.enemyTowers = towers.filter((t) => !t.my);

    const flags = getObjectsByPrototype(Flag);
    World.myFlag = flags.find((f) => f.my);
    World.enemyFlag = flags.find((f) => !f.my);
}