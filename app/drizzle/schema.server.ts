import { desc } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const resources = sqliteTable("resources", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  href: text("href").notNull(),
});

export const owners = sqliteTable("owners", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  image_url: text("image_url"),
  description: text("description"),
  images: text("images"),
});

export const owner_images = sqliteTable("owner_images", {
  id: integer("id").primaryKey(),
  owner_name: text("owner_name").notNull().references(() => owners.name),
  image_url: text("image_url").notNull(),
});

export const students = sqliteTable("students", {
  id: integer("id").primaryKey(),
  name: text("name"),
  category: text("category"),
  description: text("description"),
  image_url: text("image_url"),
});

// Auth
export const Users = sqliteTable("Users", {
  id: text("id").primaryKey().notNull(),
  username: text("username").notNull(),
  password: text("password"),
  github_id: text("github_id"),
  google_id: text("google_id"),
  email: text("email"),
  avatar_url: text("avatar_url"),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  expires_at: integer("expires_at").notNull(),
});

// Assuming you have an S3 client setup somewhere in your app
// const S3 = new S3Client({
//   region: "auto",
//   endpoint: `https://bbe111b6726945b110b32ab037e4c232.r2.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: "e74dc595a3b18668b5e9f6795929cf3c",
//     secretAccessKey:
//       "b3c68d4ced82ad17a964d22648266c0a0b6fc55d0cf8b5f775e1183b4616b065",
//   },
// });
