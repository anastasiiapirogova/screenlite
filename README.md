# Screenlite
Screenlite is an open-source digital signage solution, providing an alternative to costly proprietary software.

Get in early, use it now, and help shape what comes next. Your feedback, insights, and contributions will directly influence the future of Screenlite. Together, we’ll create a solution that’s simple, powerful, and truly free.

⚠️ **Development notes:**  

> Screenlite is currently **in public development** and **not ready for production use**. It’s not feature-complete yet.

> Database migrations may not be incremental at this stage. Sometimes migrations will be cleared and recreated, requiring you to reset your database to run newer versions of the app.

## Community
Join our Discord community for quick support, connect with other users, and share ideas.

[Join our Discord](https://discord.gg/2wW8zDjAjr)

## Running with Docker (Development Only)

You can run Screenlite in a development environment using Docker. This is the recommended way to get started quickly for testing and development purposes.

1. **Clone the repository:**
	```sh
	git clone https://github.com/screenlite/screenlite.git
	cd screenlite
	```

2. **Start the app using Docker Compose:**
	```sh
	docker compose up -d
	```

3. **Access Screenlite:**
	Open your browser and go to [http://localhost:3001](http://localhost:3001) (or the port you configured).

> **Note:** Only development mode is currently supported. Production-ready Docker deployment will be available in a future release.

## Spotted a bug? Want to suggest a feature?
Let us know by opening an issue on GitHub.

## Contribute
If you have coding skills, feel free to explore the code, suggest improvements, or submit a pull request.

UI/UX designers are also welcome. Your ideas and expertise can help make Screenlite more intuitive and user-friendly.

Let’s build something great together.

## Deployment
Screenlite is simple to set up and deploy. You can quickly configure and get it running with minimal effort.

[Deployment docs link]