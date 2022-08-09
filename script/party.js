import * as stats from './stats.js'
import * as rpg from './rpg.js'

const HEALER=[]
const ROGUE=[]
const TANK=[]

class Party{
  constructor(){
    this.races=rpg.shuffle(stats.races,true)
    this.professions=[]
    this.make()
  }
  
  make(){
    for(let r of Array.from(this.races)){
      let favored=r.favor()
      favored=favored.filter(f=>this.professions.indexOf(f)<0)
      if(favored.length>0) this.professions.push(rpg.pick(favored))
      else this.races.splice(this.races.indexOf(r),1)
    }
    if(this.races.length>6){
      this.races=this.races.splice(0,6)
      this.professions=this.professions.splice(0,6)
    }
  }
}

export function make(){
  let party=new Party()
  console.log(party.races.map(r=>r.name))
  console.log(party.professions.map(p=>p.name))
}
