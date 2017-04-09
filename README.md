# Ghostbook - A "Guestbook" in Go.

"Guestbook" huh...  Been a while since they've been called that.  Puns tho.

This will be a self-hosted standalone binary which acts as a comment server for a static site such as generated by [Hugo](https://gohugo.io).

## Quickstart

### Frontend

* Run `npm install ghostbook`;
* Reference `node_modules/ghostbook/dist/ghostbook.js` in your HTML, template, or build process.  Ensure it is included after your ghostbook element on the page<sup>\*</sup> ;
* Define a block level element within which to contain Ghostbook on the pages you want it, with the following data tags:
    * `data-ghostbook-url="[url]"`:  The URL of your Ghostbook instance, for example `https://comments.example.com:55864/`;
    * `data-ghostbook-comments-root="[url]"`:  The URL which points to the folder within which your comment json files reside, for example `https://comments.example.com/`;
    * `data-ghostbook-id="[id]"`:  The ID whose comments you wish to display and add to on this page.  For blogs, the page slug will do, though you can use the same `id` on many pages to have the same comment thread if you wish.

One tiny caveat:  Don't use `"_ghostbook_write_test"` for an `id`.

<sup>\* It's a good idea to have your javascript load after your DOM anyway.</sup>

### Backend

* Download the appropriate binary from [github.com/asday/ghostbook/bin/](https://github.com/asday/ghostbook/bin/) on your server;
* Set the following environment_variables:
    * `GB_SITE_HOST`:  The root URL under which the comments will be created - to be added to CORS headers;
    * `GB_COMMENTS_FOLDER`:  The publically served folder within which to save the comment files;
    * `GB_COMMENT_LENGTH_LIMIT`:  Self-explanatory;
    * `GB_PORT`:  The port upon which to run the Ghostbook server.  This defaults to `55864`;
* If you are going to use CAPTCHA, (and you probably should), set the following additional environment variables:
    * `GB_CAPTCHA_SITE_ID`;
    * `GB_CAPTCHA_SECRET`;
* Run `./ghostbook`, (or `ghostbook.exe`) with whatever task runner you wish.

If your chosen port is open to the world, and you don't want to use HTTPS, or subdomains, or host your instance under a path, you're done.  If not, you'll need to point your web server at your Ghostbook instance.

## How

Ghostbook will run as a RESTful http server with one endpoint, which is write only.  This endpoint will take two arguments; the page's ID upon which the comment is being made, and the comment body.

When receiving this data, the server will validate it for comment length, returning a `400 Bad Request` and discarding the data if the limit is violated, then prepend the comment to an array in a json-formatted file which corresponds with the page ID, and return `201 Created`, along with a json object representing the submitted comment.

If Ghostbook is running with CAPTCHA enabled, a second endpoint which serves the site ID required for the CAPTCHA widget will also be available.

That's it.  For the server, at least.

The idea from that point, is the folder in which the json files are saved is served statically by a web server such as nginx.  On the client side; the Ghostbook javascript downloads this file asynchronously and displays the comments in its interface.  The Ghostbook javascript will get the page's ID from a data tag on the element which contains it.

## Why

disqus leaves a lot to be desired.  The problem is, it's difficult to find a good comment hosting service, especially one for free.  Self-hosting is more and more of a viable option nowadays, but programs like [Isso](https://posativ.org/isso/) require reasonably complex setup, which may not be feasible on all providers.

Go sidesteps all of this by compiling to a standalone binary.

On a more philosophical level; I personally believe that good discussion perpetuates if and only if the following criteria are met:

* Anonymous commentary;
* Chronological ordering of comments only;
* Little to no moderation;
* No "comment scoring" à la reddit.

These combine to form a system in which comments stand solely upon their own merits, which, in the age of Candid's Orwellian AI moderator, is exceedingly important.
