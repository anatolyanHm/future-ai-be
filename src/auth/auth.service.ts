import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserFirebaseService } from '../user';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(
    private readonly userFirebaseService: UserFirebaseService,
    @Inject('FIREBASE_APP') private readonly firebaseApp: app.App,
  ) {}

  async signUpWithEmail(
    email: string,
    password: string,
    role: string = 'user',
  ): Promise<{ uid: string; token: string }> {
    try {
      const { uid, token } = await this.userFirebaseService.create({
        email,
        password,
      });

      await this.userFirebaseService.setRole(uid, role);

      return {
        uid,
        token,
      };
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException(error.message);
    }
  }

  async signInWithEmail(
    email: string,
    password: string,
  ): Promise<{ uid: string; token: string }> {
    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        this.firebaseApp.getAuth(),
        email,
        password,
      );

      const user = userCredential.user;
      const tokenId = await user.getIdToken();

      if (!user) throw new UnauthorizedException('Invalid credentials');

      // const token = await this.userFirebaseService.auth.createCustomToken(
      //   user.uid,
      // );

      return {
        uid: user.uid,
        token: tokenId,
      };
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException(error.message);
    }
  }
}
