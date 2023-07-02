import { Request, Response } from 'express';

export type ExpressRequestType = Request;
export type ExpressResponseType = Response;

export type MorganTokensType = {
    method: (req: ExpressRequestType, res: ExpressResponseType) => string,
    ip: (req: ExpressRequestType, res: ExpressResponseType) => string,
    url: (req: any, res: any) => string,
    status: (req: any, res: any) => string,
    "response-time": (req: any, res: any) => string
};