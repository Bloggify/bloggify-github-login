"use strict";

const GitHubOAuth = require("github-oauth")
    , GitHub = require("gh.js")
    ;

/**
 * @name bloggify:init
 * @param  {Object} config
 *
 *  - `loginURI` (String): The application login url.
 *  - `callbackURI`(String): The application login callback url.
 *  - `githubClient` (String): The application client id.
 *  - `githubSecret` (String): The application client secret.
 *  - `scope` (String): The user scopes (default: `user:email`).
 *
 *  To create a GitHub application, [click here](https://github.com/settings/applications/new).
 *
 * #### Events
 *
 * :arrow_up: The following events are emitted by the module:
 *
 *  - **`login-error`** (err, [lien](https://github.com/LienJS/Lien), ghApiClient)
 *
 *    An error happened durring the error.
 *
 *  - **`login-success`** token, user, res.lien, ghApiClient);
 *
 *     The user metadata was fetched. If you don't want to fetch
 *
 *  - **`token`** (token, lien, ghApiClient)
 *
 *     Emitted when the token is successfully got.
 */
exports.init = function (config, bloggify) {

    config.baseURL = bloggify.options.metadata.domain;
    let ghClient = GitHubOAuth(config);

    // Set up the routes
    bloggify.server.addPage(config.loginURI, lien => {
        lien.res.lien = lien;
        ghClient.login(lien.req, lien.res);
    });

    bloggify.server.addPage(config.callbackURI, lien => {
        lien.res.lien = lien;
        ghClient.callback(lien.req, lien.res);
    });

    this.ghClient = ghClient;

    ghClient.on("error", (err, res) => {
        this.emit("login-error", err, res.lien, ghApiClient);
    });

    ghClient.on("token", (token, res) => {
        if (token.error) {
            return ghClient.emit("error", token, res);
        }

        this.emit("token", token, res.lien, ghApiClient);
        let ghApiClient = new GitHub(token.access_token);
        ghApiClient.get("user", (err, user) => {

            if (err) {
                return ghClient.emit("error", err, res, ghApiClient);
            }

            ghApiClient.get("user/emails", (err, emails) => {

                if (err) {
                    return ghApiClient.emit("error", err, res);
                }

                user.emails = emails;

                this.emit("login-success", token, user, res.lien, ghApiClient);
            });
        });
    });
};
