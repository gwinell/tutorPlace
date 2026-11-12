CREATE TABLE `demo_kumir_compile_limits` (
	`client_hash` text PRIMARY KEY NOT NULL,
	`window_start` integer NOT NULL,
	`attempts` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `demo_kumir_compile_limits_window_start_idx` ON `demo_kumir_compile_limits` (`window_start`);
