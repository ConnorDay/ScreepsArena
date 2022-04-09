import { AnyCreep, ResourceConstant, ScreepsReturnCode } from "game/constants";
import { Store, Structure, StructureTower } from "game/prototypes";
import { findClosestByPath, findClosestByRange, getRange } from "game/utils";
import { World } from "./world";

class Tower {
	private _primitiveTower: StructureTower;
	constructor(tower: StructureTower) {
		this._primitiveTower = tower;
	}

	/**
	 * Priority:
	 *  1. Attack any enemy creep that's within 5 tiles of the flag
	 *  2. Heal any allied creep that's within 50 tiles of the tower and while energy is > 50%
	 *  3. Attack any enemy creep that's within 50 tiles and while energy == 100%?
	 */
	public run() {
		const close: AnyCreep[] = [];
		const targets: AnyCreep[] = [];

		//Populate $close and $targets
		World.enemies.forEach((c) => {
			const dist = getRange(this, c);
			if (dist <= 5) {
				close.push(c);
			} else if (dist <= 50) {
				//Should $targets also contain all of $close?
				targets.push(c);
			}
		});

		//Priority 1
		if (close.length > 0) {
			const target = findClosestByPath(World.myFlag, close);
			this.attack(target);
			return;
		}

		//Priority 2
		if ((this.store.getUsedCapacity("energy") as number) >= 40) {
			const target = targets.reduce((prev, curr) => {
				//I need the getDanger function before this can function
				return prev;
			}, World.allies[0]);
		}
		//Add the check that the creep is actually in danger here

		//Priority 3
		if (this.store.getUsedCapacity("energy") === 50) {
			const target = findClosestByRange(this, targets);
			this.attack(target);
			return;
		}

		return; // c:
	}

	/////////////////////////////////
	// Mappings to primitive tower //
	/////////////////////////////////

	//Getters//
	public get my(): boolean {
		return this._primitiveTower.my;
	}

	public get hits(): number {
		return this._primitiveTower.hits;
	}

	public get hitsMax(): number {
		return this._primitiveTower.hitsMax;
	}

	public get x(): number {
		return this._primitiveTower.x;
	}

	public get y(): number {
		return this._primitiveTower.y;
	}

	//Get rid of this entirely? just replace with energy/ max energy/ missing energy?
	public get store(): Store<ResourceConstant> {
		return this._primitiveTower.store;
	}

	public get cooldown(): number {
		return this._primitiveTower.cooldown;
	}

	//functions//
	public attack(target: AnyCreep | Structure): ScreepsReturnCode {
		return this._primitiveTower.attack(target);
	}

	public heal(target: AnyCreep): ScreepsReturnCode {
		return this._primitiveTower.heal(target);
	}
}

export { Tower };
