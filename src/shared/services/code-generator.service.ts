import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeGeneratorService {
  generateCode(length: number, characters: string): string {
    // eslint-disable-next-line unicorn/no-new-array
    const code: string[] = new Array(length)
      // eslint-disable-next-line unicorn/no-null
      .fill(null)
      .map(() => characters[this.randomInteger(0, characters.length - 1)]);

    return code.join('');
  }

  private randomInteger(min: number, max: number): number {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);

    return rand;
  }
}
