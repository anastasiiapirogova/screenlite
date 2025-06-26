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
			],
			[STATUS.UI]: [
				"List user workspaces",
				"List user invitations",
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
				"Update workspace",
			],
			[STATUS.DONE]: [
				"Dashboard"
			]
		}
	},
	{
		section: "Files",
		features: {
			[STATUS.PLANNED]: [
				"Storage setup documentation",
				"Feature component to manage selected files/folders (move, delete, etc.)"
			],
			[STATUS.IN_PROGRESS]: [
				"Auto-update playlists when related files are deleted",
				"Clear trash"
			],
			[STATUS.DONE]: [
				"Video preview",
				"Metadata generation",
				"Optimized thumbnail generation",
				"Serve static content",
				"Force delete files/folders",
				"S3 storage",
				"Local storage",
				"Drag and drop files/folders management",
				"Resumable multipart uploads"
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
