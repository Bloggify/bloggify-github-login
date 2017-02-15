"use strict";

const GitHubOAuth = require("github-oauth")
    , GitHub = require("gh.js")
    ;


/**
 * bloggifyGithubLogin
 * Login with GitHub for Bloggify.
 *
 * @param  {Object} config   The configuration object.
 *
 *  - `loginURI` (String): The application login url.
 *  - `callbackURI`(String): The application login callback url.
 *
 * @param  {Bloggify} bloggify The `Bloggify` instance.
 */
exports.init = function (config, bloggify) {
    config.baseURL = bloggify.options.metadata.domain;
    let ghClient = GitHubOAuth(config);

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
        this.emit("login-error", err, res.lien);
    });

    ghClient.on("token", (token, res) => {
        if (token.error) {
            return ghClient.emit("error", token, res);
        }

        let ghApiClient = new GitHub(token.access_token);
        ghApiClient.get("user", (err, user) => {

            if (err) {
                return this.emit("error", err, res, ghApiClient);
            }

            ghApiClient.get("user/emails", (err, emails) => {

                if (err) {
                    return this.emit("error", err, res);
                }

                user.emails = emails;

                this.emit("login-success", token, user, res.lien, ghApiClient);
            });
        });
    });
};
