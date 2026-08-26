# Made With These Hands shadcn Registry

This project has a source shadcn registry at `registry.json`.

It packages the reusable Made With These Hands system as installable kits:

- `mwth-button`
- `mwth-carousel`
- `mwth-slideshow-block`
- `mwth-podcast-player`
- `mwth-directus-block-renderer`
- `mwth-brand-book`
- `mwth-component-guardrails`
- `mwth-component-factory-mcp`
- `mwth-storybook-kit`

Directus remains the content and page-builder source of truth. The shadcn registry is for distributing approved code, guardrails, docs, MCP setup files, and reusable component implementation files.

## Validate

```bash
npm run registry:validate
```

This runs the official shadcn registry validator against `registry.json`.

## Build

```bash
npm run registry:build
```

This writes generated registry payloads to `public/r`.

Examples:

```text
public/r/registry.json
public/r/mwth-podcast-player.json
public/r/mwth-component-factory-mcp.json
public/r/mwth-brand-book.json
public/r/mwth-storybook-kit.json
```

## Storybook

Storybook documents the same approved blocks that Directus can render.

```bash
npm run storybook
npm run storybook:build
npm run storybook:verify
```

The first story set covers:

- Directus-shaped page-block rendering
- Podcast player variants
- Slideshow variants
- Brand Book component inventory

## Test Locally

Start the Next.js app:

```bash
npm run dev -- -p 3038
```

Then inspect the registry:

```bash
npx shadcn@latest list http://localhost:3038/r/registry.json
npx shadcn@latest view http://localhost:3038/r/mwth-podcast-player.json
```

Install an item into another compatible project:

```bash
npx shadcn@latest add http://localhost:3038/r/mwth-podcast-player.json
```

## Namespace Setup

Once the site or registry endpoint is hosted, a client project can add a namespace:

```bash
npx shadcn@latest registry add @mwth=https://madewiththesehands.ie/r/{name}.json
```

Or manually in `components.json`:

```json
{
  "registries": {
    "@mwth": "https://madewiththesehands.ie/r/{name}.json"
  }
}
```

Then install items by namespace:

```bash
npx shadcn@latest add @mwth/mwth-podcast-player
npx shadcn@latest add @mwth/mwth-component-factory-mcp
```

## GitHub Registry Option

If this repository becomes public, the root `registry.json` also supports GitHub registry installation:

```bash
npx shadcn@latest registry validate <owner>/<repo>
npx shadcn@latest list <owner>/<repo>
npx shadcn@latest add <owner>/<repo>/mwth-podcast-player
```

For private or authenticated use, prefer the hosted namespace endpoint with authentication rather than GitHub registry addresses.
