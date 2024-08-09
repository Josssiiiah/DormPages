CREATE TABLE `owner_images` (
	`id` integer PRIMARY KEY NOT NULL,
	`owner_name` text NOT NULL,
	`image_url` text NOT NULL,
	FOREIGN KEY (`owner_name`) REFERENCES `owners`(`name`) ON UPDATE no action ON DELETE no action
);
