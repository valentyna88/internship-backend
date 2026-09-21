import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginationObject } from '../common/utils/pagination.util';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async findUserOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ ...dto, passwordHash });
    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User created: ${savedUser.email}`);
    return { user: savedUser };
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const [items, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return createPaginationObject(items, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.findUserOrThrow(id);
    return { user };
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findUserOrThrow(id);

    const { password, ...rest } = dto;

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    Object.assign(user, rest);
    const updatedUser = await this.userRepository.save(user);

    this.logger.log(`User updated: ${updatedUser.email}`);
    return { user: updatedUser };
  }

  async remove(id: string) {
    const user = await this.findUserOrThrow(id);

    await this.userRepository.remove(user);

    this.logger.log(`User deleted: ${user.email} (ID: ${id})`);

    return { id };
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOrCreateByAuth0Email(email: string): Promise<User> {
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      return existingUser;
    }
    const temporaryPassword = randomBytes(16).toString('hex') + 'A0!';
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);
    const user = this.userRepository.create({ email, passwordHash });
    const savedUser = await this.userRepository.save(user);
    this.logger.log(`Auth0 User auto-registered: ${savedUser.email}`);
    return savedUser;
  }
}
