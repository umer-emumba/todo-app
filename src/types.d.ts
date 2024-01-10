declare namespace Express {
  //to extend express request so that we can attach user object with request in middleware
  export interface Request {
    user: any;
  }
  export interface Response {
    user: any;
  }
}
