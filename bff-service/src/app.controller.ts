import {
  Controller,
  All,
  Param,
  HttpStatus,
  HttpException,
  Req,
  Inject,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Method } from 'axios';
import { CACHE_URLS, CACHE_TTL } from './constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  services: {
    [key: string]: string;
  };
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
  ) {
    this.services = {
      cart: process.env.CART_SERVICE_URL,
      product: process.env.PRODUCT_SERVICE_URL,
    };
  }

  @All('/:serviceName')
  async proxy(@Param('serviceName') serviceName, @Req() req: Request) {
    const serviceUrl = this.services[serviceName];
    if (!serviceUrl) {
      throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
    }
    const { method, body, originalUrl } = req;
    const isCacheable = CACHE_URLS.includes(originalUrl);
    if (isCacheable) {
      const cachedResponse = await this.cacheManager.get(originalUrl);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    const recipientURL = originalUrl.split('/').slice(2).join('/');

    try {
      const { data } = await this.httpService
        .request({
          url: `${serviceUrl}/${recipientURL}`,
          method: method as Method,
          data: body,
        })
        .toPromise();
      if (isCacheable) {
        await this.cacheManager.set(originalUrl, data, CACHE_TTL);
      }
      return data;
    } catch (err) {
      if (err.isAxiosError) {
        throw new HttpException(err.response.data, err.response.status);
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
