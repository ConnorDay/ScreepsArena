import { Creep } from "game/prototypes";
import { BaseCreep } from "../basecreep";

export function asignCreep(creep: Creep): BaseCreep {
	return new BaseCreep(creep);
}
