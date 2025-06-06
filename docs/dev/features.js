const STATUS = {
	UI: "UI",
	DONE: "Done",
	IN_PROGRESS: "In Progress",
	PLANNED: "Planned"
}

export const features = [
	{
		section: "Authentication & Security",
		features: {
			[STATUS.DONE]: [
				"Sign in",
				"Sign up",
				"Terminate session",
				"Terminate all sessions",
				"Change email",
				"Change password",
				"Set 2FA",
				"Disable 2FA",
				"Verify 2FA",
				"List active sessions"
			],
			[STATUS.IN_PROGRESS]: [
				"Email verification",
				"Password reset"
			]
		}
	},
	{
		section: "User Profile",
		features: {
			[STATUS.DONE]: ["Set profile picture", "Set profile name"],
			[STATUS.PLANNED]: ["Language preference", "Delete profile picture"],
			[STATUS.IN_PROGRESS]: ["Delete account"]
		}
	},
	{
		section: "Workspace",
		features: {
			[STATUS.DONE]: ["Create workspace"]
		}
	},
	{
		section: "Files",
		features: {
			[STATUS.UI]: ["Upload files"],
			[STATUS.DONE]: ["Generate thumbnails"]
		}
	},
	{
		section: "Screens",
		features: {
			[STATUS.UI]: ["List screens", "Connect device"],
			[STATUS.DONE]: ["Create screen"]
		}
	},
	{
		section: "Playlists",
		features: {
			[STATUS.DONE]: ["Create playlist"],
			[STATUS.UI]: ["List playlists", "Edit playlist"]
		}
	}
]