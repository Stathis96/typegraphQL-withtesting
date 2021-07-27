import { MyContext } from "../../types/MyContext";
import { MiddlewareFn } from "type-graphql";

export const logger: MiddlewareFn<MyContext> = async ({ args }, next) => {
  console.log('args: ', args);
  return next();
   //we always need to call next,its like calling the next
  //middleware, or if there isnt any, its ownself
};