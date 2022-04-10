import { Creep } from "game/prototypes";
import { BaseCreep } from "./basecreep";
import { TestRole } from "./testRole";

const roster = [
<<<<<<< HEAD
    {
        role: BaseCreep,
    },
];

export function assignCreep(creep: Creep): BaseCreep {
    return new TestRole(creep);
=======
	{
		role: BaseCreep,
	},
];

export function assignCreep(creep: Creep): BaseCreep {
	return new TestRole(creep);
>>>>>>> fa1af1a (commit)
}
