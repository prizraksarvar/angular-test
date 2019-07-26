import {Controller} from "../../core/component/controller";
import {RouteMiddlewareTypes} from "../../core/component/route-middleware-types";
import {RequestInterface} from "../../core/http/request-interface";
import {ResponseInterface} from "../../core/http/response-interface";
import {NextFunction} from "../../core/http/next.function";
import {getRepository} from "typeorm";
import {readFile} from "fs";
import {parseString} from "xml2js";
import * as http from "http";
import {IncomingMessage} from "http";


const BACK_HOST = 'localhost';
let BACK_PORT = 4200;
const CURRENT_HOST = 'localhost';
let CURRENT_PORT = 33120;

let backHostName = BACK_HOST;
if (BACK_PORT != 80 && BACK_PORT != 443) {
  backHostName += ":" + BACK_PORT;
}

let currentHostName = CURRENT_HOST;
if (CURRENT_PORT != 80 && CURRENT_PORT != 443) {
  currentHostName += ":" + CURRENT_PORT;
}

export class TestController extends Controller {
  initMiddleware(): void {
    this.registerMiddleware(this.getItems.bind(this));
  }

  private getItems(request: RequestInterface, response: ResponseInterface, next: NextFunction) {
    let newHeaders = TestController.getHeaderFormRequest(request);

    TestController.replaceEnvsInHeadersForBack(newHeaders);

    const f = this.proccessBackResponse.bind(this,response);
    let req = http.request({
      host: BACK_HOST,
      port: BACK_PORT,
      method: request.method,
      path: request.path,
      headers: newHeaders
    },f);
    req.on('error', (e) => {
      console.log('error', e)
    });
    req.end();
  }

  proccessBackResponse(response: ResponseInterface, income: IncomingMessage) {
    response.status(income.statusCode ? income.statusCode : 0);
    let contentLength = 0;
    if (typeof income.headers === 'object') {
      for (let k in income.headers) {
        if (!income.headers.hasOwnProperty(k))
          continue;
        if (k === 'content-length') {
          contentLength = parseInt(<string>income.headers[k]);
          continue;
        }

        response.header(k, <any>TestController.replaceEnvsInHeaderForCurrent(income.headers[k]));
      }
    }

    console.log(contentLength);

    let readed = 0;
    let content = '';
    income.on('data', (chunk) => {
      //response.write(chunk);
      readed += chunk.length;
      content += chunk;
    });

    income.on('end', () => {
      console.log('end!');
      response.send(TestController.replaceEnvsInHeaderForCurrent(content));
    });
  }

  static replaceEnvsInHeadersForBack(headers:any) {
    for (let k in headers) {
      if (!headers.hasOwnProperty(k))
        continue;
      headers[k] = this.replaceEnvsForBack(<string>headers[k]);
    }
  }

  static replaceEnvsInHeaderForCurrent(headerValue:string | string[] | undefined) {
    if (typeof headerValue === 'undefined') {
      return;
    } else if (typeof headerValue === 'string') {

    } else {
      headerValue.forEach((item, index) => {
        headerValue[index] = this.replaceEnvsForCurrent(item);
      });
    }
    return headerValue;
  }

  static replaceEnvsForBack(str:string):string {
    return str.replace(currentHostName,backHostName);
  }

  static replaceEnvsForCurrent(str:string):string {
    return str.replace(backHostName,currentHostName);
  }

  static getHeaderFormRequest(request: RequestInterface) {
    let newHeaders: any = {};
    for (let k in request.headers) {
      if (!request.headers.hasOwnProperty(k))
        continue;
      newHeaders[k] = request.headers[k];
    }
    return newHeaders;
  }
}
