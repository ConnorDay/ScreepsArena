import { Creep } from "game/prototypes";
import { BaseCreep, Loadout } from "./basecreep";
import { Defender } from "./defender";
import { Skirmisher } from "./skirmisher";

interface rosterEntry {
    role: any;
    my: boolean;
    composition: {
        [key in Loadout]: number;
    };
}

const roster: rosterEntry[] = [
    {
        role: Defender,
        my: true,

        composition: {
            archer: 1,
            brawler: 1,
            healer: 2,
        },
    },
    {
        role: Skirmisher,
        my: true,

        composition: {
            archer: 4,
            brawler: 0,
            healer: 4,
        },
    },
];

export function assignCreep(creep: BaseCreep): BaseCreep {
    for (let entry of roster) {
        if (creep.my === entry.my && entry.composition[creep.loadout] > 0) {
            entry.composition[creep.loadout]--;
            return new entry.role(creep.primitiveCreep);
        }
    }
    return new BaseCreep(creep.primitiveCreep);
}
