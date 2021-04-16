import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '../repositories/IUsersTokensRepository';

// import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
}

@injectable()
class SendPasswordForgotEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if(!checkUserExists) {
      throw new AppError('User does not exists.')
    }

    this.mailProvider.sendMail(email, 'pedido de recuperação de senha recebido')
  }
}

export default SendPasswordForgotEmailService;
