import { ApolloServer } from "apollo-server-express"
import Express from "express"
import "reflect-metadata" ;
import { createConnection } from "typeorm";
import session from 'express-session'
import connectRedis from 'connect-redis'
import { redis } from "./redis";
import cors from "cors";
import { MyContext } from "./types/MyContext";
import { createSchema } from "./utils/createSchema";



const main = async () => {

  await createConnection();
  const schema = await createSchema();
  // const schema = await buildSchema({ // i could call the createSchema util,but just so i can reread the comments hopefully someday 
  //   resolvers: [__dirname + "/modules/**/*.ts"],
  //   authChecker: ({ context: { req } }) => {
  //     // here we can read the user from context
  //     // and check his permission in the db against the `roles` argument
  //     // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  //     if (req.session.userId){
  //       return true
  //     }
  //   return false
  //   //INSTEAD OF IFSTATEMENTS -> return !!req.session.userId;
  //   } 
  // });



  const apolloServer = new ApolloServer({ 
    schema,
    context ({ req, res }: any): MyContext {
      return {
        req,
        res
      }
    }
  })
  const app = Express();  

  const RedisStore = connectRedis(session)
  
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }));

    //we want the session to be applied before we reach our resolvers
    app.use(
      session({
        store: new RedisStore({
          client: redis as any
        }),
        name: "qid",
        secret: "aslkdfjoiq12312",
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
        }
      })
    );  

  
  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  })
}

main();