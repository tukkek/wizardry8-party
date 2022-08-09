class Stats{
  constructor(name,str=0,int=0,pie=0,vit=0,dex=0,spd=0,sen=0){
    this.name=name
    this.str=str
    this.int=int
    this.pie=pie
    this.vit=vit
    this.dex=dex
    this.spd=spd
    this.sen=sen
  }
  
  *iterate(){
    let all=[this.str,this.int,this.pie,this.vit,this.dex,this.spd,this.sen]
    for(let stat of all) yield stat
  }
  
  toString(){return this.name}
}

class Profession extends Stats{
  constructor(name,str=0,int=0,pie=0,vit=0,dex=0,spd=0,sen=0){
    super(name,str,int,pie,vit,dex,spd,sen)
  }
}

class Race extends Stats{
  constructor(name,str=0,int=0,pie=0,vit=0,dex=0,spd=0,sen=0){
    super(name,str,int,pie,vit,dex,spd,sen)
  }
  
  meet(profession,strict=true){
    let p=[...profession.iterate()]
    let r=[...this.iterate()]
    let met=p.length
    for(let i=0;i<p.length;i++) if(p[i]>0&&r[i]<45){
      if(strict) return false
      else met-=1
    }
    return strict?true:met>=6
  }
  
  favor(){
    var favored=professions.filter(p=>this.meet(p))
    if(favored.length>0) return favored
    return professions.filter(p=>this.meet(p,false))
  }
}

export var fighter=new Profession('Fighter',55,0,0,50,50,0,0)
export var lord=new Profession('Lord',55,0,55,55,50,50,0)
export var valkyrie=new Profession('Valkyrie',50,0,55,55,50,50,0)
export var ranger=new Profession('Ranger',50,50,0,50,55,0,55)
export var samurai=new Profession('Samurai',50,55,0,50,55,55,0)
export var ninja=new Profession('Ninja',50,50,0,50,55,55,50)
export var monk=new Profession('Monk',0,50,50,0,50,55,55)
export var rogue=new Profession('Rogue',0,0,0,0,55,50,50)
export var gadgeteer=new Profession('Gadgeteer',45,55,0,0,60,0,55)
export var bard=new Profession('Bard',45,50,0,0,0,55,55)
export var priest=new Profession('Priest',0,0,60,55,0,0,0)
export var alchemist=new Profession('Alchemist',0,55,0,0,60,0,0)
export var bishop=new Profession('Bishop',0,55,55,0,55,0,55)
export var psionic=new Profession('Psionic',0,55,0,0,0,0,60)
export var mage=new Profession('Mage',0,60,0,0,55,0,0)

export var human=new Race('Human',45,45,45,45,45,45,45)
export var dracon=new Race('Dracon',55,35,30,60,50,40,30)
export var dwarf=new Race('Dwarf',45,30,50,60,35,35,35)
export var elf=new Race('Elf',35,50,50,35,50,45,40)
export var faerie=new Race('Faerie',25,55,35,30,50,60,45)
export var felpurr=new Race('Felpurr',40,40,30,35,50,60,40)
export var gnome=new Race('Gnome',35,50,40,50,50,35,45)
export var hobbit=new Race('Hobbit',40,40,30,45,55,50,50)
export var lizardman=new Race('Lizardman',60,25,25,70,40,50,30)
export var mook=new Race('Mook',50,50,25,50,35,35,55)
export var rawulf=new Race('Rawulf',40,30,55,50,40,40,50)

export var professions=[fighter,lord,valkyrie,ranger,samurai,ninja,monk,rogue,gadgeteer,bard,priest,alchemist,bishop,psionic,mage]
export var races=[human,dracon,dwarf,elf,faerie,felpurr,gnome,hobbit,lizardman,mook,rawulf]

export function test(){
  console.log('#professions: '+professions.length)
  console.log('#races: '+races.length)
  for(var r of races){
    let favored=r.favor()
    console.log(`${r}: #${favored.length} ${favored.join(', ')}`)
  }
}
