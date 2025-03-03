# Local Development Set Up
The SFD has a number of repositories. The following instructions should get you set up so that you can run the Single Front Door service locally. There is some information, such as environment variables, that can't be provided/shared publicly in this guide, but the team will provide all of the environment variables needed to get the SFD up and running locally. 

1. Clone the [fcp-sfd-core](https://github.com/defra/fcp-sfd-core) repository from GitHub. This makes local development a lot easier because you'll be able to build, start, and stop multiple Docker containers for each of our micro-services with a single command. The core also enables you to checkout to main branches and pull latest updates.

2. Run the `npm run clone` command to get all repos cloned to your local machine.

3. You'll need all of the environment variables for all our microservices so that the Docker containers can build successfully. Ask anyone on the development team and they'll give you everything you need.

4. Once your `.env` file set up is complete, you'll need to build and then start all the Docker containers:

```
docker-compose up --build
```

If at any stage you come into any errors and have issues with troubleshooting, don't hesitate to reach out to the team and we'll get it sorted.
***
 There are two environment variables which you won't receive values for: `DEV_AUTH_PUBLIC_KEY` and `DEV_AUTH_PRIVATE_KEY`. These are only needed when `DEFRA_ID_ENABLED` is set to `false` and the `fcp-fd-auth` service will automatically generate values for both of these variables on start up.