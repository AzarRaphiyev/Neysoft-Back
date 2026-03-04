import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'admin@neysoft.az' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}