import * as stats from './stats.js'
import * as rpg from './rpg.js'

const REALMS={
  'psionics':[stats.psionic,stats.monk,stats.bishop,],
  'alchemy':[stats.alchemist,stats.bishop,],
  'divinity':[stats.priest,stats.valkyrie,stats.bishop],
  'wizardry':[stats.mage,stats.samurai,stats.bishop,],
}
const HEALER=[...new Set(['alchemy','divinity','psionics'].flatMap(m=>REALMS[m]))]
const BNE=[stats.ninja,stats.rogue,stats.bard,stats.gadgeteer]
const TANK=[stats.fighter,stats.lord,stats.valkyrie,stats.samurai,stats.monk,stats.bard,stats.priest,stats.rogue]
const CASTER=[stats.bishop,stats.mage,stats.samurai,stats.monk,stats.gadgeteer,stats.bard]
const MELEE=[stats.fighter,stats.lord,stats.valkyrie,stats.samurai,stats.ninja,stats.monk,stats.rogue,stats.bard,stats.gadgeteer,stats.priest,]
const SUPPORT=[stats.ranger,stats.samurai,stats.ninja,stats.monk,stats.bard,stats.gadgeteer,stats.priest,stats.alchemist,stats.bishop,stats.psionic,stats.mage]
const ROLES=[HEALER,TANK,BNE]
const OPTIONALROLES=[CASTER]
const SEXES=[true,false]

class Hero{
  constructor(male,race,profession=false){
    this.male=male
    this.race=race
    this.profession=profession
    this.realms=[]
  }
  
  toString(){
    let p=this.profession?this.profession.name:'?'
    let sex=this.male?'♂':'♀'
    let s=`${sex} ${this.race.name} ${p.toLowerCase()}`
    if(this.realms.length>1)
      s+=` (${this.realms.join(', ')})`
    return s
  }
  
  compare(hero){
    let a=MELEE.indexOf(this.profession)>=0
    let b=MELEE.indexOf(hero.profession)>=0
    if(a==b) return 0
    return a&&!b?-1:+1
  }
  
  setup(){
    let realms=Object.keys(REALMS)
    this.realms=realms.filter(r=>REALMS[r].indexOf(this.profession)>=0)
    if(this.realms.length>1)
      this.realms=rpg.shuffle(this.realms).slice(0,2).sort()
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
    rpg.shuffle(this.heroes).sort((a,b)=>a.compare(b))
    for(let h of this.heroes) h.setup()
    return true
  }
  
  make(){
    this.heroes=[]//SEXES.map(s=>new Hero(s,stats.human))
    let nonhuman=stats.races.filter(r=>r!=stats.human)
    this.heroes.push(...nonhuman.map(r=>new Hero(true,r)))
    this.heroes.push(...nonhuman.map(r=>new Hero(false,r)))
    for(let i=0;i<nonhuman.length;i++) this.heroes.push(new Hero(i%2==0,stats.human))
    rpg.shuffle(this.heroes)
    //this.heroes.push(...[new Hero(true,stats.human),new Hero(false,stats.human)])
    for(let h of this.heroes){
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
