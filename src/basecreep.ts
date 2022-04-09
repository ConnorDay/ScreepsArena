import {
	AnyCreep,
	BodyPartConstant,
	CreepActionReturnCode,
	CreepMoveReturnCode,
	DirectionConstant,
	ERR_BUSY,
	ERR_INVALID_TARGET,
	ERR_NOT_OWNER,
	ERR_NO_BODYPART,
	ERR_NO_PATH,
	OK,
	ResourceConstant,
} from "game/constants";
import { MoveToOpts } from "game/path-finder";
import { Creep, RoomPosition, Store, Structure } from "game/prototypes";
import { World } from "./world";

class BaseCreep extends Creep {
	//Extend creep so that we can just pass BaseCreep in to attack/ heal targets
	private _primativeCreep: Creep;
	constructor(creep: Creep) {
		super();
		this._primativeCreep = creep;
	}

	public run() {
		this.moveTo(World.enemyFlag);
	}

	/////////////////////////////////
	// Mappings to primitive tower //
	/////////////////////////////////

	//Getters//
	public get hits(): number {
		return this._primativeCreep.hits;
	}

	public get hitsMax(): number {
		return this._primativeCreep.hitsMax;
	}

	public get my(): boolean {
		return this._primativeCreep.my;
	}

	public get fatigue(): number {
		return this._primativeCreep.fatigue;
	}

	public get body(): Array<{ type: BodyPartConstant; hits: number }> {
		return this._primativeCreep.body;
	}

	public get store(): Store<ResourceConstant> {
		return this._primativeCreep.store;
	}

	public get x(): number {
		return this._primativeCreep.x;
	}

	public get y(): number {
		return this._primativeCreep.y;
	}

	//Functions//
	public move(direction: DirectionConstant): CreepMoveReturnCode | undefined {
		return this._primativeCreep.move(direction);
	}

	public moveTo(
		target: RoomPosition,
		opts?: MoveToOpts
	): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | undefined {
		return this._primativeCreep.moveTo(target, opts);
	}

	public rangedAttack(target: AnyCreep | Structure): CreepActionReturnCode {
		return this._primativeCreep.rangedAttack(target);
	}

	public rangedMassAttack(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART {
		return this._primativeCreep.rangedMassAttack();
	}

	public attack(target: AnyCreep | Structure): CreepActionReturnCode {
		return this._primativeCreep.attack(target);
	}

	public heal(target: AnyCreep): CreepActionReturnCode {
		return this._primativeCreep.heal(target);
	}

	public rangedHeal(target: AnyCreep): CreepActionReturnCode {
		return this._primativeCreep.rangedHeal(target);
	}
}

export { BaseCreep };
