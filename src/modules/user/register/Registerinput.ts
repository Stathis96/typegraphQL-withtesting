import { IsEmail, Length } from "class-validator";
import { PasswordInput } from "../../shared/PasswordInput";
import { Field, InputType, } from "type-graphql";
import { isEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class Registerinput extends PasswordInput{

  @Field() 
  @Length(1, 255)
  firstName: string

  @Field() 
  @Length(1, 255)
  lastName: string

  @Field()
  @IsEmail()
  @isEmailAlreadyExist({ message: "Email already in use"})
   email: string

}