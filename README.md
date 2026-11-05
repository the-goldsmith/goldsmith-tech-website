# Goldsmith AI & Software Portfolio

> **Intelligence, engineered.** A responsive portfolio for exploring Goldsmith's software, AI, security-minded design, connected hardware, and supervised robotics concepts.

The site combines an editorial-style portfolio with interactive service and concept catalogs. **Ananta** is a hybrid guide: it answers recognized catalog and FAQ questions from local site content, and can send broader questions to GitHub Copilot through a server-side Netlify Function when configured.

> [!IMPORTANT]
> This website is a portfolio and project-inquiry experience, not a store. Product and project entries are illustrative concepts—not confirmed inventory, ready-made products, client deployments, or guarantees of delivery. Hardware entries are suggestions, not validated bills of materials. There is no checkout.

## At a glance

| Topic | Details |
|---|---|
| Project | Goldsmith AI & Software Portfolio |
| Format | Static HTML, CSS, and browser JavaScript, with an optional serverless chatbot endpoint |
| Main experience | Services, visual demos, products, hardware, projects, help, collaboration, and contact |
| Site assistant | Ananta; local catalog/FAQ guide with optional GitHub Copilot replies |
| Hosting configuration | Netlify (`netlify.toml`) |
| Required Node.js for the Copilot SDK | 22.12 or later |
| Product concepts | 49 illustrative entries |
| Hardware suggestions | 41 entries; stock and compatibility are unconfirmed |
| Project studies | 5 illustrative studies |
| Service profiles | 46 service profiles |
| Chat history | Not saved by this site |

Counts describe the website's current catalog content and may change as the portfolio is updated.

## Contents

- [Explore the portfolio](#explore-the-portfolio)
- [Catalog guide](#catalog-guide)
- [Ananta assistant](#ananta-assistant)
- [Technology](#technology)
- [Run the website](#run-the-website)
- [Deploy on Netlify](#deploy-on-netlify)
- [Privacy and content notes](#privacy-and-content-notes)
- [Project map](#project-map)
- [Tests](#tests)

## Explore the portfolio

| Section | What visitors can explore |
|---|---|
| **Home** | Goldsmith introduction and interactive hero artwork |
| **About** | Company principles, technology areas, and an illustrative system map |
| **Services** | Service profiles, guided discovery, comparison tools, and visual demonstrations |
| **Robotics** | Human-supervised, non-weaponized robotics and drone concepts |
| **Products** | Illustrative product concepts, product details, comparison, and an inquiry bag |
| **Hardware** | Suggested component types, IoT and survey planning tools, and compatibility prompts |
| **Projects** | Concept studies and their visual galleries |
| **Help** | Frequently asked questions and a link to Ananta |
| **Collaboration** | Ways to start a conversation about a project |
| **Contact** | Project inquiry form and the published contact email |

The visual system map, workflow, dashboard, gallery, and hero effects are **portfolio demonstrations**, not live monitoring or deployed customer systems. No unverified company social-media accounts are linked.

## Catalog guide

| Catalog | Current size | Intended use | Important qualification |
|---|---:|---|---|
| Services | 46 profiles | Explore areas such as custom software, applied AI, automation, security-minded design, and prototyping | A listed capability is not a confirmed quote, engagement, or delivery commitment |
| Products | 49 concepts | Browse illustrative software and product ideas; compare selected concepts | Concepts are not ready-made items for sale |
| Hardware | 41 suggestions | Review example component types and planning prompts | Not inventory or an approved bill of materials; check specifications, compatibility, rules, and availability |
| Projects | 5 studies | Explore sample project directions and visual galleries | Illustrative studies, not completed client work or deployed products |

Visitors can add concepts to the **inquiry bag** to bring them into a project inquiry. The bag is a shortlist only; it does not reserve, order, or purchase anything.

## Ananta assistant

Ananta combines locally available Goldsmith information with an optional Copilot-powered endpoint:

| Visitor question | How Ananta responds |
|---|---|
| Recognized service, product, hardware, project, or FAQ question | Replies from the site's local catalog and prepared information; catalog entries can link to their details |
| Unrecognized or open-ended question | Sends the current question and recent conversation context to `/.netlify/functions/ananta` for a GitHub Copilot response, if the function and server credential are configured |
| Copilot is unavailable or not configured | Shows a local fallback and explains that live replies need a working deployment/configuration |

The server-side endpoint validates request sizes and conversation messages, limits request frequency, uses a constrained Copilot session without ambient tools, and returns a bounded reply. It does not expose the credential to browser code. **Do not send confidential or sensitive information through the chatbot.**

To enable live responses, deploy the site with Netlify Functions and set `COPILOT_GITHUB_TOKEN` as a secret environment variable in Netlify. Copilot authentication and usage must be authorized for the account/provider. A token is not included in this repository; never commit credentials or paste them into client-side files.

## Technology

| Layer | Technologies |
|---|---|
| Page structure | HTML5 |
| Visual presentation | CSS, responsive layouts, and SVG |
| Interactions | Browser JavaScript and Canvas |
| Artwork generation | Python standard library (`generate_hero_art.py`) |
| Optional chatbot backend | Netlify Functions and `@github/copilot-sdk` |
| Test runner | Node.js built-in test runner |

Google Fonts and some image assets load from external providers, so opening the relevant pages may make requests to those providers.

## Run the website

### View the static site

Open `index.html` in a browser to explore the static portfolio. A direct file open does **not** run the Netlify Function, so live Copilot chat is only available when the backend is served.

### Run the site and function locally

1. Install Node.js 22.12 or later.
2. From the project root, install the project dependencies:

   ```sh
   npm install
   ```

3. Configure `COPILOT_GITHUB_TOKEN` for your local Netlify development environment, without adding the credential to tracked files.
4. Start Netlify's local development server:

   ```sh
   npx netlify-cli dev
   ```

5. Open the local URL printed by the CLI.

If no Copilot credential is configured, the site can still be explored and local Ananta answers still work; broader questions use the fallback response.

## Deploy on Netlify

1. Create a Netlify site and import the GitHub repository.
2. Use the repository root as the site root. The included `netlify.toml` sets the publish directory to `.` and the function directory to `netlify/functions`.
3. In the Netlify site settings, add `COPILOT_GITHUB_TOKEN` as a **secret environment variable** for the functions runtime. Do not put its value in GitHub, HTML, or JavaScript.
4. Deploy the site and test the chat. If live answers do not work, check the deployed function logs and verify that the credential is valid and permitted for Copilot SDK use.

The Netlify configuration selects Node.js 22.12 for the project and bundles functions with esbuild. GitHub Pages serves static files and does not run this Netlify Function; use a compatible serverless backend if deploying somewhere else.

## Privacy and content notes

- This website does not save chatbot conversation history.
- Local catalog and FAQ answers are handled in the visitor's browser.
- When a Copilot reply is requested and the backend is configured, the current question and up to five recent chat messages are sent to the Netlify Function and forwarded to GitHub Copilot.
- Netlify and GitHub may process requests under their own privacy policies. See the site's [`privacy.html`](privacy.html), [Netlify privacy notice](https://www.netlify.com/privacy/), and [GitHub privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
- Avoid submitting passwords, API keys, payment details, confidential material, or sensitive personal information.
- Robotics and drone concepts are non-weaponized and intended for supervised inspection, mapping, or observation.

This README describes the project, not a guarantee of business availability, technical specifications, compatibility, security certification, pricing, or delivery timelines. Contact the Goldsmith team to confirm project feasibility and terms.

## Project map

| Path | Purpose |
|---|---|
| `index.html` | Main portfolio page, catalogs, dialogs, contact flow, and Ananta chat interface |
| `styles.css` | Site styling and responsive layouts |
| `script.js` | Catalog data, local Ananta replies, navigation, visual tools, and page interactions |
| `hero-scene.js` | Interactive Canvas scene in the homepage hero |
| `generate_hero_art.py` | Python script for generating the hero telemetry artwork |
| `assets/` | Website images and generated visual assets |
| `netlify/functions/ananta.mjs` | Server-side Copilot chat endpoint |
| `netlify.toml` | Netlify publish, function, and runtime configuration |
| `package.json` / `package-lock.json` | Node.js SDK dependency and test script |
| `tests/` | Chat-function validation and SDK loading tests |
| `privacy.html` | Privacy notice, including Ananta's optional Copilot data flow |
| `terms.html` | Website terms |
| `sitemap.html` / `sitemap.js` | Human-readable sitemap |
| `404.html` | Not-found page |
| `thank-you.html` | Contact-form confirmation page |
| `snake.html` | Standalone page in the project |

## Tests

Install dependencies, then run:

```sh
npm test
```

The tests cover chatbot request validation, method and body handling, the missing-credential response, and loading the Copilot SDK. They do not authenticate with a live Copilot account.

---

**Goldsmith** · Software, AI, and responsible technology concepts  
Project inquiries: [services@goldsmith.gold.in](mailto:services@goldsmith.gold.in)
