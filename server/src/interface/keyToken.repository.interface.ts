export interface IKeyTokenRepository {
  findByUserId(userId: string): Promise<any | null>;
  deleteByUserId(userId: string): Promise<any>;
  updateRefreshToken(data: {
    userId: string;
    refreshToken: string;
    refreshTokensUsed: string[];
  }): Promise<any>;
  upsertToken(data: {
    userId: string;
    refreshToken: string;
    refreshTokensUsed: string[];
    publicKey: string;
    privateKey: string;
  }): Promise<any>;
}
