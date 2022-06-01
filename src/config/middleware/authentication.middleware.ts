/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request } from 'express-serve-static-core';
import { request, response, Response } from 'express';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private jwtService: JwtService
  use(req: Request, res: Response, next: Function) :void{  
    console.log("Request",req.cookies);
    const token:any = req.cookies['jwt'];
    console.log("Token",token);
    // const data = this.jwtService.verifyAsync(token)
    // console.log("FROM DATA")
    console.log("Requesttt",req)
    next();
  }  
}


