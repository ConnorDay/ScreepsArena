import { World } from './world';
import { getTicks } from "game/utils";
import { init } from './init';

export function loop(){
    if (getTicks() === 1){
        init();
    }

    World.myTowers.forEach( t => t.run() );

}