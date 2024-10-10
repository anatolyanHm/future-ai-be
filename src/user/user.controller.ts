import { Body, Controller, Put } from '@nestjs/common';

//import { UserService } from './user.service';
import { UserDto } from '../auth/dto/auth.dto';

const MOCK = {
  title: '',
  status: '',
  date: new Date(),
  description: '',
  userId: '',
};

@Controller('user')
export class UserController {
 // constructor(private readonly userService: UserService) {}

  // @Put('/update')
  // updateUser(@Body() entity: UserDto) {
  //   return this.userService.update();
  // }
}
