export class User {
  uid: string;
  email: string;
  role: string;
  createdAt: Date;
}

export abstract class FirebaseService {
  abstract create(entity: unknown): Promise<unknown>;

  abstract getById(uid: string): Promise<unknown | null>;

  abstract getAll(): Promise<unknown[]>;
}
