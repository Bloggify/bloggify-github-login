## Documentation

You can see below the API reference of this module.

### Plugin Configuration

 - `loginURI` (String): The application login url.
 - `callbackURI`(String): The application login callback url.
 - `githubClient` (String): The application client id.
 - `githubSecret` (String): The application client secret.
 - `scope` (String): The user scopes (default: `user:email`).

 To create a GitHub application, [click here](https://github.com/settings/applications/new).

#### Events

:arrow_up: The following events are emitted by the module:

 - **`login-error`** (`err`, [`lien`](https://github.com/LienJS/Lien), ghApiClient)

   An error happened durring the error.

 - **`login-success`** (`token`, `user`, `lien`, `ghApiClient`);

    The user metadata was fetched. If you don't want to fetch

 - **`token`** (`token`, `lien`, `ghApiClient`)

    Emitted when the token is successfully got.

