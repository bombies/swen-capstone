# One Yaad Marketplace

Welcome to the One Yaad Marketplace, a full-stack e-commerce platform designed to empower local Jamaican entrepreneurs by connecting them with a broader customer base. Built on a modern, serverless-first architecture, this application provides a robust and scalable solution for online commerce.

**Key Features:**

- **Complete E-commerce Flow:** From product catalogues to shopping carts and order management.

- **Secure Authentication:** JWT-based authentication with multi-session and role-switching capabilities.

- **Merchant Dashboard:** A dedicated portal for sellers to manage products and view analytics.

- **Modern Tech Stack:** Built with NestJS, Next.js, MongoDB, and deployed serverlessly with SST on AWS.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- [**Bun**](https://bun.sh/): The JavaScript runtime and package manager used for this project.

- [**AWS CLI**](https://aws.amazon.com/cli/): The command-line interface for interacting with AWS services.

- **An AWS Account**: You will need an active AWS account with programmatic access (Access Key ID and Secret Access Key).

### 1. Install Dependencies

First, clone the repository to your local machine. Navigate to the project's root directory and install all the necessary dependencies using Bun.

```bash
bun install
```

### 2. Configure AWS Credentials

For SST to deploy the application to your AWS account, you need to configure your local environment with your AWS credentials. If you haven't done so already, configure the AWS CLI with your Access Key ID and Secret Access Key.

You can do this by running:

```bash
aws configure
```

Follow the prompts to enter your credentials, default region (e.g., `us-east-1`), and default output format.

### 3. Populate Environment Variables

The project uses environment variables to manage sensitive information like database connection strings, API keys, and other secrets.

First, create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Next, open the newly created `.env` file and populate it with the required values. Below is a description of each variable:

- **`MongoDbUri`**: This is the connection string for your MongoDB database. The backend service uses this URI to connect to, read from, and write to the database. You can obtain this from your cloud MongoDB provider (e.g., MongoDB Atlas).

  - _Example:_ `mongodb+srv://<user>:<password>@cluster0.mongodb.net/your-database-name`

- **`JwtSecret`**: This is a secret, private key used to sign the JSON Web Tokens (JWTs) that handle user authentication. It should be a long, complex, and random string to ensure your application's security. You can generate a strong secret using a password generator.

  - _Example:_ `a-very-long-and-super-secret-key-that-no-one-can-guess`

- **`PayPalClientId`**: This is your client ID for the PayPal REST API. It is used by the frontend to render the PayPal Smart Buttons and initiate the payment process.

  - _Example:_ `AZDxjD8cRj9f...`

- **`PayPalAccessToken`**: This is your secret or access token for the PayPal REST API. It is used by the backend to securely process transactions, such as creating orders and capturing payments.

  - _Example:_ `A21AALg_s...`

You can get your `PayPalClientId` and `PayPalAccessToken` by creating a new REST API app in the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/).

### 4. Load Secrets into SST

SST has a secure way of managing secrets for your serverless application. Once your `.env` file is populated, you can load these secrets into your SST application. This command will encrypt and store your secrets so they can be securely accessed by your Lambda functions in production.

Run the following command from the root of the project:

```bash
bunx sst secret load .env
```

## Local Development

To start the application in development mode, SST provides a powerful `dev` command. This launches the _Live Lambda Development_ environment, which connects your local machine to your AWS resources. This allows you to test your Lambda functions live in the cloud while benefiting from local development features like hot-reloading for both the frontend and backend.

To start the dev server, run:

```bash
bunx sst dev
```

This will output a URL for your local development site, which you can open in your browser to view the application. Any changes you make to the frontend or backend code will be reflected instantly.

## Deployment

When you are ready to deploy your application to a live AWS environment, you can use the `deploy` command provided by SST. This will package your application, provision all the necessary AWS resources using AWS CDK, and deploy your code.

To deploy the application, run:

```bash
bunx sst deploy
```

This command will deploy your application to the stage (environment) configured in your `sst.config.ts` file. You can also specify a different stage for deployment, for example, to deploy to a production environment:

```bash
bunx sst deploy --stage production
```

After a successful deployment, SST will output the URL of your live application, along with other relevant resource information.
