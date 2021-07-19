import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NewCarInput } from "./datatoobjects/new-car-input";
import { Car } from "./entities/car";

@Injectable()
export class CarsService{

    constructor(@InjectRepository(Car) private carRepository: Repository<Car>){

    }

    public async getCars(): Promise<Car[]>{
        return await this.carRepository.find({}).catch((err) => {
            throw new InternalServerErrorException()
        })   
    }

    public async addCar(newCarData: NewCarInput): Promise<Car>{
        const newcar = this.carRepository.create(newCarData)
        await this.carRepository.save(newcar).catch((err) => {
            new InternalServerErrorException()

        })
        return newcar
    }
}