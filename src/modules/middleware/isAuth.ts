import { MyContext } from "../../types/MyContext";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if(!context.req.session!.userId){
    throw new Error("Not Authenticated,cant login")
  }
  return next();
};