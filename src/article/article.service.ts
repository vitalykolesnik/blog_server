import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  async createArcticle(): Promise<any> {
    return 'create article service';
  }
}
