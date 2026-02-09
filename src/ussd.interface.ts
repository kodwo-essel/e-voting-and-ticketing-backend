export interface USSDRequest {
  USERID: string;
  MSISDN: string;
  USERDATA: string;
  MSGTYPE: boolean;
  NETWORK?: string;
  SESSIONID?: string;
}

export interface USSDResponse {
  USERID: string;
  MSISDN: string;
  USERDATA: string;
  MSG: string;
  MSGTYPE: boolean;
}

export interface IUSSDService {
  handleRequest(request: USSDRequest): Promise<USSDResponse>;
}