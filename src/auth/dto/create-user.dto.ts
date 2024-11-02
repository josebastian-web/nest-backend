import { IsEmail, IsString, MinLength } from "class-validator";


// DTO Data transfer object
export class CreateUserDto {

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @MinLength(6)
  password: string;


}
