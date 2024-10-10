import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserFirebaseService } from '../user';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Client-side Firebase SDK
import { app, auth as adminAuth } from 'firebase-admin'; // Admin SDK

@Injectable()
export class AuthService {
  constructor(
    private readonly userFirebaseService: UserFirebaseService,
    @Inject('FIREBASE_APP') private readonly firebaseApp: app.App, // Admin SDK app
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
      const auth = getAuth(); // Client-side authentication

      const userCredential = await signInWithEmailAndPassword(
        auth, // use client-side `auth`
        email,
        password,
      );

      const user = userCredential.user;
      const tokenId = await user.getIdToken(); // Get user token from client-side

      if (!user) throw new UnauthorizedException('Invalid credentials');

      // Optionally, you can generate a custom token for the user via the Admin SDK
      const customToken = await this.firebaseApp.auth().createCustomToken(user.uid);

      return {
        uid: user.uid,
        token: customToken, // Return custom token
      };
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException(error.message);
    }
  }
}
