import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto } from './dto';

import { User } from './entities/user.entity';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginRespose } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    
    try {
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });


      await newUser.save();
      const { password:_, ...user } = newUser.toJSON();

      return user;

    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${ createUserDto.email } already exist`);
      }
      
      throw new InternalServerErrorException('Something terrible happend');
    }

  }

  async register( registerDto: RegisterUserDto): Promise<LoginRespose> {
    const user = await this.create( registerDto );

    return {
      user: user,
      token: this.getJwtToken({ id: user._id }),
    }
  }

  async login(loginDto: LoginDto):Promise<LoginRespose> {

    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    // Si no está el usuario
    if ( !user ) {
      throw new UnauthorizedException('Not valid credential - email');
    }
    // Comparamos la password ingresada con la que trae la consulta del usuario con el mail
    if ( !bcryptjs.compareSync( password, user.password ) ) {
      throw new UnauthorizedException('Not valid credential - password');
    }

    const { password:_, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    };

  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById( id: string) {
    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();

    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayload) {

    const token = this.jwtService.sign(payload);
    return token;

  }

}