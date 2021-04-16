import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
  suscard: string;
  birthdate: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashprovider: IHashProvider,
  ) {}

  public async execute({ name, email, password, suscard, birthdate }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email addres alread used.');
    }
    console.log(name)
    console.log(email)
    console.log(password)
    console.log(suscard)
    console.log(birthdate)

    const hashedPassword = await this.hashprovider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      suscard,
      birthdate,
    });

    return user;
  }
}

export default CreateUserService;
