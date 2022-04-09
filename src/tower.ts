import { AnyCreep, ResourceConstant, ScreepsReturnCode } from "game/constants";
import { Store, Structure, StructureTower } from "game/prototypes";

class Tower{
    private _primitiveTower: StructureTower;
    constructor(tower: StructureTower){
        this._primitiveTower = tower;
    }
    public run(){
        console.log("i'm a tower :)");
    }


    /////////////////////////////////
    // Mappings to primitive tower //
    /////////////////////////////////

    //Getters//
    public get my(): boolean{
        return this._primitiveTower.my;
    }

    public get hits(): number{
        return this._primitiveTower.hits;
    }

    public get hitsMax(): number{
        return this._primitiveTower.hitsMax;
    }

    //Get rid of this entirely? just replace with energy/ max energy/ missing energy?
    public get store(): Store<ResourceConstant>{
        return this._primitiveTower.store;
    }

    public get cooldown(): number{
        return this._primitiveTower.cooldown;
    }

    //functions//
    public attack( target: AnyCreep | Structure ): ScreepsReturnCode{
        return this._primitiveTower.attack(target);
    }

    public heal( target: AnyCreep ): ScreepsReturnCode{
        return this._primitiveTower.heal(target);
    }
}

export {Tower};