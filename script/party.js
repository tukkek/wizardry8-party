import * as stats from './stats.js'
import * as rpg from './rpg.js'

const MAGIC={
  'mental':[stats.psionic,stats.monk,stats.bishop,],
  'water':[stats.alchemist,stats.bishop,],
  'divine':[stats.priest,stats.valkyrie,stats.bishop,],
  'fire':[stats.mage,stats.samurai,stats.bishop,],
}
const HEALER=[...new Set(['water','divine','mental'].flatMap(m=>MAGIC[m]))]
const BNE=[stats.ninja,stats.rogue,stats.bard,stats.gadgeteer]
const TANK=[stats.fighter,stats.lord,stats.valkyrie,stats.samurai,stats.monk,stats.bard,stats.priest,stats.rogue]
const CASTER=[stats.bishop,stats.mage,stats.samurai,stats.monk,stats.gadgeteer,stats.bard]
const MELEE=[stats.fighter,stats.lord,stats.valkyrie,stats.samurai,stats.ninja,stats.monk,stats.rogue,stats.bard,stats.gadgeteer,stats.priest,]
const SUPPORT=[stats.ranger,stats.samurai,stats.ninja,stats.monk,stats.bard,stats.gadgeteer,stats.priest,stats.alchemist,stats.bishop,stats.psionic,stats.mage]
const ROLES=[HEALER,TANK,BNE]
const OPTIONALROLES=[CASTER]

class Hero{
  constructor(race,profession=false){
    this.race=race
    this.profession=profession
  }
  
  toString(){
    let p=this.profession?this.profession.name:'?'
    return `${this.race} ${p.toLowerCase()}`
  }
  
  compare(hero){
    let a=MELEE.indexOf(this.profession)>=0
    let b=MELEE.indexOf(hero.profession)>=0
    if(a==b) return 0
    return a&&!b?-1:+1
  }
}

class Party{
  constructor(){
    this.heroes=[]
  }
  
  select(role){return this.heroes.find(h=>role.indexOf(h.profession)>=0)}
  
  place(position){
    let placed=this.heroes.filter(h=>position.indexOf(h.profession)>=0)
    return placed.length>=3&&placed.slice(0,3)
  }
  
  setup(){
    let chosen=rpg.shuffle(ROLES).map(r=>this.select(r))
    if(chosen.findIndex(c=>!c)>=0) return false
    chosen.push(...rpg.shuffle(OPTIONALROLES).map(r=>this.select(r)).filter(r=>r))
    let melee=this.place(MELEE)
    let support=this.place(SUPPORT)
    if(!melee||!support) return false
    chosen.push(...melee)
    chosen.push(...support)
    chosen=new Set(chosen)
    if(chosen.size>6) return false
    for(let i=0;chosen.size<6&&i<this.heroes.length;i++)
      chosen.add(this.heroes[i])
    if(chosen.size!=6) return false
    this.heroes=[...chosen]
    /*for(let i=0;i<=this.professions,length;i++)
      if(!chosen.has(this.professions[i])){
        this.professions.splice(i,1)
        this.races.splice(i,1)
      }*/
    this.heroes.sort((a,b)=>a.compare(b))
    return true
  }
  
  make(){
    this.heroes=rpg.shuffle(stats.races).map(r=>new Hero(r))
    for(let h of Array.from(this.heroes)){
      let favored=h.race.favor()
      favored=favored.filter(f=>this.heroes.map(h=>h.profession).indexOf(f)<0)
      if(favored.length>0) h.profession=rpg.pick(favored)
      else this.heroes.splice(this.heroes.indexOf(h)) //this.races.splice(this.races.indexOf(h.race),1)
    }
    return this.heroes.length>=6&&this.setup()
  }
}

export function make(){
  let p=new Party()
  while(!p.make()) continue
  return p
}
