import { Request, Response } from 'express';




export class SSE {
  private user_requests: { [key:string]: { [key:string]: { request: Request, response: Response } } } = {};

  constructor() { }

  addConnection(key: string, request: Request, response: Response) {
    if (!this.user_requests[key]) {
      this.user_requests[key] = {};
    }
    const connectionId = Date.now();
    this.user_requests[key][connectionId] = { request, response };

    request.on(`close`, (event) => {
      console.log(`connection closed:`, { connectionId, event });
      delete this.user_requests[key][connectionId];
    });

    return connectionId;
  }

  removeConnection(key: string, connectionId: string) {
    if (!this.user_requests[key]) {
      return;
    }
    if (!this.user_requests[key][connectionId]) {
      return;
    }
    const connection = this.user_requests[key][connectionId];
    delete this.user_requests[key][connectionId];
    connection.response.end();
  }

  getConnectionsByKey(key: string): { request: Request, response: Response }[] {
    return !this.user_requests[key] ? [] : Object.values(this.user_requests[key]);
  }

  sendData(key: string, event: string, data: { [key:string]: any }) {
    if (!this.user_requests[key]) {
      return;
    }
    const requests = Object.values(this.user_requests[key]);
    for (let i = 0; i < requests.length; i++) {
      const connection: { request: Request, response: Response } = requests[i];
      connection.response.write("event: " + event + "\n" + "data: " + JSON.stringify(data) + "\n\n");
    }
  }
}