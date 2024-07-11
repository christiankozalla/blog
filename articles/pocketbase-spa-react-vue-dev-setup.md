---
"title": "Dev setup for using PocketBase with React/Vue"
"date": "2024-07-09"
"author": "Christian Kozalla"
"shortTitle": "Development setup for serving an SPA like React or Vue from PocketBase while connecting to the backend via the PocketBase JavaScript SDK."
"description": "Development setup for serving an SPA like React or Vue from PocketBase while connecting to the backend via the PocketBase JavaScript SDK."
"imageUrl": "/images/pocketbase-spa-react-vue-dev-setup/header.jpeg"
"tags": ["Pocketbase", "Vue", "React"]
"isInDb": true
---


# My Dev Setup for using PocketBase with React/Vue

## TLDR;

```
├── Caddyfile.dev
├── go.mod
├── go.sum
├── main.go
├── modd.conf
├── Procfile
└── web-frontend
```

### modd.conf

```bash
# modd.conf
**/*.go {
    daemon +sigterm: "CGO_ENABLED=0 go run main.go serve"
}
```

### Caddyfile.dev

```yaml
# Caddyfile.dev
http://localhost:3000 {
        # PocketBase
        reverse_proxy /api/* http://localhost:8090

        # Frontend Dev Server
        reverse_proxy * http://localhost:5173
}
```

### Procfile

```yaml
# For Development only
# Used with [Hivemind](https://evilmartians.com/opensource/hivemind)
# Install Hivemind and run `hivemind` from the project root to start development

docker: docker run --rm --network host -v $(pwd)/Caddyfile.dev:/etc/caddy/Caddyfile:ro caddy:latest
frontend: npm -C web-frontend run dev
api: modd

```

## Details

For my development setup of a custom PocketBase backend with a Vue.js frontend I am using several tools: Modd, Caddy and Hivemind. Modd recompiles Golang sources file on every change, Caddy acts as a reverse-proxy to serve requests to the frontend dev server and PocketBase from the same origin. And Hivemind simply runs all processes, i.e. frontend dev server, Caddy and Modd, in parallel through a single command.

With Caddy as a reverse-proxy there's arguably some overhead, but it's definitely worth it, because you get the advantage that your frontend makes only same-origin requests, although it is talking to both the frontend dev server and PocketBase, which run on different hosts in development. So Caddy prevents you from having to deal with CORS in your frontend and backend only for the sake of "making development work".

### PocketBase Development with Modd

When running a custom PocketBase setup, not the pre-compiled binary, there's a `main.go` file, `pb_data` and `pb_public` directories in the root of the project.

This command starts the PocketBase backend:

```bash
CGO_ENABLED=0 go run main.go serve
```

### SPA Development

I am using the development server provided by the SPA framework. For Vue.js the dev server is invoked via `npm run dev`.

### Caddy Reverse-Proxy

Let's say PocketBase runs on `localhost:8090` and the SPA dev server on `localhost:5173`. When visting the frontend from the browser, it will make requests to PocketBase, so there will be CORS issues if nothing is configured - aka no `Access-Control-Allow-Origin` headers etc. Furthermore, cookies will be handled differently by `fetch` compared with same-origin requests and responses. So without Caddy you'll end up writing code on both frontend and backend just to configure CORS which is entirely a "development problem" and not relevant in production.

> In production, the SPA will be built into static assets served by PocketBase from the `pb_public` directory. So there is only one host and no CORS issues at all!

```Caddyfile
# Caddyfile.dev
http://localhost:3000 {
        # PocketBase
        reverse_proxy /api/* http://localhost:8090

        # Frontend Dev Server
        reverse_proxy * http://localhost:5173
}
```

With this Caddyfile the whole app runs on a single host, i.e. localhost:3000, and the PocketBase backend and frontend dev server are hidden from the browser.

## Production

Building and deploying the whole app to production involves three steps:

1. Build the SPA and copy the static assets into `pb_public`
2. Build the PocketBase binary and upload it along with `pb_data` and `pb_public` to the server
3. On the server a systemd service has been configure which basically invokes the binary with `./pocketbase serve`. systemd does does this whenever the binary has been replaced. Additionally, another Caddy server (not the one from Caddyfile.dev above!) runs on the server as a reverse-proxy.