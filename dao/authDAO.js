import crypto from "node:crypto";
import argon2 from "argon2";
import mongodb from "mongodb";

let users;
let sessions;
const sessionDurationMs = 1000 * 60 * 60 * 24 * 7;

export default class AuthDAO {
  static async injectDB(conn) {
    if (users && sessions) {
      return;
    }

    const database = conn.db("reviews");
    users = database.collection("users");
    sessions = database.collection("sessions");
    await users.createIndex({ email: 1 }, { unique: true });
    await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  }

  static async createUser(email, password, displayName) {
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    const result = await users.insertOne({
      email,
      passwordHash,
      displayName,
      createdAt: new Date(),
    });
    return { id: result.insertedId.toString(), email, displayName };
  }

  static async verifyCredentials(email, password) {
    const user = await users.findOne({ email });
    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      return null;
    }
    return {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
    };
  }

  static async createSession(userId) {
    const token = crypto.randomBytes(32).toString("base64url");
    await sessions.insertOne({
      token,
      userId: new mongodb.ObjectId(userId),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + sessionDurationMs),
    });
    return token;
  }

  static async getUserBySession(token) {
    if (!token) {
      return null;
    }
    const session = await sessions.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });
    if (!session) {
      return null;
    }
    return users.findOne(
      { _id: session.userId },
      { projection: { passwordHash: 0 } },
    );
  }

  static async deleteSession(token) {
    if (token) {
      await sessions.deleteOne({ token });
    }
  }
}
