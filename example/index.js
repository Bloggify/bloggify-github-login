"use strict";

const Bloggify = require("bloggify");
const GitHub = Bloggify.require("github-login");
const User = Bloggify.models.User;

// On successful login
GitHub.on("login-success", (token, user, lien) => {

    // Check if there is already an existing user
    User.get({
        username: user.login
    }, (err, existingUser) => {

        if (err) {
            Bloggify.log(err);
            return lien.redirect("/");
        }

        if (existingUser) {
            lien.startSession({
                user: existingUser
            });
        } else {
            const newUser = new Bloggify.models.User({
                username: user.login,
                email: user.emails[0].email,
                profile: {
                    bio: user.bio,
                    website: user.blog,
                    full_name: user.name,
                    picture: user.avatar_url,
                    github_username: user.login
                }
            });

            lien.startSession({
                user: newUser.toObject()
            });
        }

        lien.redirect("/");
    });
});
