import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);
    const userExist = await this.userRepository.findOne({ where: { email: rest.email } });
    if (userExist) {
      throw new ConflictException('Usuário com e-mail já cadastrado');
    }
    const newUser = this.userRepository.create({ ...rest, passwordHash });
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { password, ...rest } = updateUserDto;

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      this.userRepository.merge(user, { ...rest, passwordHash });
    } else {
      this.userRepository.merge(user, rest);
    }

    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
