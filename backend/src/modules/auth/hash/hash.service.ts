import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  public constructor() {}

  public async generate(data: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
  }

  public async compare(data: string, hash: string) {
    return await bcrypt.compare(data, hash);
  }
}
