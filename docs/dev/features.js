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
				"Sign out",
				"Verify 2FA",
				"Set 2FA",
				"Disable 2FA",
				"Change password",
				"Change email",
				"Terminate session",
				"Terminate all sessions",
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
			[STATUS.DONE]: [
				"Set profile picture",
				"Set profile name"
			],
			[STATUS.PLANNED]: [
				"Language preference",
				"Delete profile picture"
			],
			[STATUS.IN_PROGRESS]: [
				"Delete account"
			]
		}
	},
	{
		section: "Workspace",
		features: {
			[STATUS.UI]: [
				"Create workspace",
				"View workspace",
				"View entity counts",
				"List invitations",
				"List folders",
				"Update workspace"
			]
		}
	},
	{
		section: "Files",
		features: {
			[STATUS.UI]: [
				"Generate thumbnails"
			],
			[STATUS.DONE]: [
				"Upload files",
				"Create folder",
				"Move to folder",
				"Trash folders"
			]
		}
	},
	{
		section: "Screens",
		features: {
			[STATUS.UI]: [
				"List screens",
				"Connect device",
				"Delete screen",
				"Disconnect device"
			],
			[STATUS.DONE]: [
				"Create screen"
			]
		}
	},
	{
		section: "Playlists",
		features: {
			[STATUS.DONE]: [
				"Create playlist"
			],
			[STATUS.UI]: [
				"List playlists",
				"Edit playlist",
				"Copy playlist",
				"Change playlist layout",
				"Add screens to playlist",
				"Remove screens from playlist",
				"Restore playlists",
				"Update playlist items"
			]
		}
	},
	{
		section: "Playlist Layouts",
		features: {
			[STATUS.UI]: [
				"View layout",
				"View layout playlists",
				"Create layout",
				"Update layout",
				"Delete layout"
			]
		}
	},
	{
		section: "Playlist Schedules",
		features: {
			[STATUS.UI]: [
				"Create schedule",
				"Update schedule",
				"Delete schedule"
			]
		}
	}
]
