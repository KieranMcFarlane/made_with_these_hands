# Made With These Hands Component Inventory

This inventory records the user-facing component families currently present in the legacy site and the Directus-rendered page system. The Brand Book at `/brand` is the visual index.

## Classification Rules

| Classification | Directus responsibility | Frontend responsibility |
| --- | --- | --- |
| Builder block | Client selects, edits, reorders, and publishes | Render one of the supported block collections |
| Listing/card | Client selects a listing type and filters | Query published editorial records and render cards |
| Structured template | Client edits the related collection record | Preserve the route’s information architecture |
| Interactive module | Client manages submitted records or moderation | Preserve validation, state, and API behaviour |
| Site chrome | Client manages global navigation/settings | Render consistently across the site |
| Primitive | Indirectly configured through component fields | Remain an implementation detail |

## Directus Builder Blocks

| Component | Collection | Purpose |
| --- | --- | --- |
| Hero | `block_hero` | Page opening, image, and up to two actions |
| Text | `block_text` | Editorial copy and structured notes |
| Media | `block_media` | Primary image or lightweight gallery |
| Quote | `block_quote` | Pull quote and attribution |
| Listing | `block_listing` | Products, makers, episodes, and posts |
| Call to action | `block_cta` | Focused closing prompt and actions |
| Slideshow | `block_slideshow` | Accessible editorial image sequences |

These seven blocks are the client-composable page vocabulary. The legacy homepage sections map onto combinations of them rather than becoming additional one-off block types.

### Controlled Layout Vocabulary

| Block | Approved variants |
| --- | --- |
| Hero | `split`, `cover`, `minimal` |
| Text | `left`, `centered`, `two-column` |
| Media | `full-width`, `figure`, `gallery` |
| Listing | `grid`, `featured`, `archive` |
| Call to action | `panel`, `band` |
| Quote | One deliberately consistent editorial treatment |
| Slideshow | `editorial`, `full-width`, `thumbnail-rail` |

Builder junction items also support `main`, `before-content`, `after-content`, and `related-content` template slots. Null legacy values resolve to `main`.

## Site Chrome

| Component | Legacy source | Directus surface |
| --- | --- | --- |
| Masthead and navigation | `MastheadMid` | `navigation_items`, `tenants` |
| Footer | `FooterMid` | `navigation_items`, `tenants` |
| Palette and display controls | `PageToggle`, display controls | `brand_settings` |

## Legacy Editorial Sections

| Component | Legacy source | Builder mapping |
| --- | --- | --- |
| Split opening | `HeroA` | Hero |
| Cover opening | `HeroB` | Hero |
| Mission statement | `Mission` | Text |
| Craft feature | `Craft` | Text + Listing |
| Founder story | `HughStory` | Media + Text + CTA |
| Podcast feature | `Podcast` | Listing + Quote + CTA |
| Artist of the week | `ArtistOfWeek` | Listing |
| Why craft matters | `WhyCraft` | Text + Quote |
| Shop prompt | `ShopCTA` | CTA |

## Cards and Listings

| Component | Legacy source | Listing type |
| --- | --- | --- |
| Product card | `DataProductCard` | `products` / `related_objects` |
| Maker card | Maker links and artists index | `makers` |
| Episode card or archive row | `PodcastArchivePage` | `episodes` / `related_episodes` |
| Journal card | `BlogCard` | `posts` / `related_posts` |

## Structured Templates

| Template | Legacy source | Directus collection |
| --- | --- | --- |
| Home | Legacy home composition | `site_pages` + blocks |
| Objects index | `ShopPage` | `products` + `site_pages` slots |
| Product detail | `DataProductPage` | `products` + `site_pages` slots |
| Makers index | `ArtistsPage` | `makers` + `site_pages` slots |
| Maker detail | `DataMakerPage` | `makers` + `site_pages` slots |
| Craft index | `DataCraftPage` | `products`, `makers` |
| Podcast archive | `DataPodcastArchivePage` | `episodes` + `site_pages` slots |
| Episode detail | `DataEpisodePage` | `episodes` + `site_pages` slots |
| Journal index | `BlogPage` | `posts` + `site_pages` slots |
| Journal article | `BlogPostPage` | `posts` + `site_pages` slots |
| Contact / commissions | `CommissionsPage` | `site_pages` slots + `enquiries` |
| Founder profile | `HughStoryPage` | `site_pages` slots + blocks |

## Interactive Modules

| Module | Legacy source | Directus/API surface |
| --- | --- | --- |
| Enquiry drawer | `EnquiryDrawer` | `enquiries` |
| Commission form | `CommissionsPage` form | `enquiries` |
| Episode comments | `EpisodeComments` | `comments` |
| Audio and transcript controls | `EpisodePage` | `episodes` |

## Shared Primitives

Actions, responsive image frames, structured copy, entity links, text inputs, and textareas remain implementation primitives. Clients configure them indirectly through the block, template, or form fields that own them.

## Gap Map

| Gap | Resolution |
| --- | --- |
| Directus media galleries were stored but not rendered | Generic Media now renders `images` JSON as a responsive gallery |
| Listing cards were not linked to their detail routes | Generic Listing now resolves product, maker, episode, and journal URLs |
| Related listing aliases were not resolved | `related_objects`, `related_episodes`, and `related_posts` map to their editorial collections |
| Brand Book only listed Builder blocks | Brand Book now includes the complete classified site inventory |
| Draft editorial items could enter generic listings | Generic listing data now queries published records only |
| Layout changes required freeform styling or frontend edits | Controlled Directus variant dropdowns now select approved layouts |
| Blocks had only one undifferentiated page region | Builder junctions now carry controlled template slots |
| Detail templates could not consume optional Builder sections | Product, maker, episode, and article routes now expose hybrid `site_pages` slots |

## Change Rule

Add a new Directus block collection only when a component cannot be expressed as a safe composition or variant of the seven supported Builder blocks. Interactive behaviour and structured content templates should retain explicit frontend contracts.
