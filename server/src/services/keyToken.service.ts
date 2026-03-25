import { IKeyTokenRepository } from '../interface/keyToken.repository.interface';

class KeyTokenService {
  constructor(private keyRepo: IKeyTokenRepository) {}

  async createKeyToken(
    userId: string,
    publicKey: string,
    privateKey: string,
    refreshToken: string,
  ) {
    const tokens = await this.keyRepo.upsertToken({
      userId,
      publicKey,
      privateKey,
      refreshToken,
      refreshTokensUsed: [],
    });

    return tokens.publicKey;
  }
}

export default KeyTokenService;
