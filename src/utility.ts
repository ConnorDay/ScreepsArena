import { BaseCreep } from "./roles/basecreep";

export function getHighestAttackPriority(creeps: BaseCreep[]): BaseCreep {
    return creeps.reduce((prev, curr) => {
        if (curr.attackPriority > prev.attackPriority) {
            return curr;
        }
        return prev;
    }, creeps[0]);
}

export function getHighestDanger(creeps: BaseCreep[]): BaseCreep {
    return creeps.reduce((prev, curr) => {
        if (curr.danger > prev.danger) {
            return curr;
        }
        return prev;
    }, creeps[0]);
}
