CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"slug" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"born" timestamp DEFAULT now() NOT NULL,
	"about" text,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_slug_unique" UNIQUE("slug"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
