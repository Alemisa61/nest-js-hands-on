import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import {Cat} from './entities/cat.entity'

@Injectable()
export class CatsService {
  private cats: Cat[] = [];
  private nextID =1
  create(createCatDto: CreateCatDto) {
    const newCat: Cat = {
     id: this.nextID++,
      ...createCatDto
    }
    this.cats.push(newCat);
    return newCat;
    
  }

  findAll() {
    return this.cats;
    
  }

  findOne(id: number) {
    const cat = this. cats.find(cat => cat.id === id)
    if (!cat) {
      throw new NotFoundException(`Cat  with ID ${id} not  found`)
    }
    return cat;
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    const cat = this.findOne(id);
    Object.assign(cat, updateCatDto)
    return cat;
  }


  remove(id: number) {
    this.findOne(id);
    this.cats = this.cats.filter(cat => cat.id !== id);
      return `a cat  with id ${ id } deleted `
    
  }
      
    
  
  }
