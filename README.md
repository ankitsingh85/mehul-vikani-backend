# Mehul Vikani — Backend & Admin Panel

Express + MongoDB (Mongoose) REST API for the Dr. Mehul Vikani website, with JWT authentication and a built-in admin panel.

## Setup

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, SUPERADMIN_*
npm run seed           # loads website content + creates the super admin
npm run dev            # or: npm start
```

- API: `http://localhost:5000/api`
- Admin panel: `http://localhost:5000/admin` (login at `/admin/login`)

`npm run seed:fresh` wipes and re-inserts treatments, blogs, testimonials, FAQs and site settings. Admin users and appointments are left untouched.

## Structure

```
server.js                 entry point (connects DB, starts server)
src/
  app.js                  express app, middleware, route mounting, admin static files
  config/                 env loading + MongoDB connection
  models/                 Admin, Appointment, Subscriber, Treatment, Blog, Testimonial, Faq, Setting
  controllers/            auth, admins, appointments, subscribers, settings, dashboard, crud.factory
  routes/                 public.routes, auth.routes, admin.routes, content (shared CRUD config)
  middleware/             auth (protect / authorize), error handling
  utils/                  ApiError, asyncHandler, slugify, escapeRegex
  seed/                   seed.js + data.json (content taken from the frontend's src/data/site.ts)
admin/                    admin panel (login.html, index.html, assets/)
```

## Authentication

`POST /api/auth/login` returns a JWT and also sets it as an httpOnly cookie. Protected routes accept either the cookie or an `Authorization: Bearer <token>` header. Changing a password invalidates previously issued tokens. Login is rate-limited to 10 attempts per 15 minutes.

| Role         | Access                                                         |
|--------------|----------------------------------------------------------------|
| `superadmin` | Everything, including managing admin users                     |
| `admin`      | Content, appointments, subscribers, site settings              |
| `editor`     | Website content only (treatments, blogs, testimonials, FAQs)   |

## API

### Public
| Method | Path | Description |
|---|---|---|
| GET  | `/api/health` | Health check |
| GET  | `/api/treatments`, `/api/treatments/:slug` | Published treatments (`?category=Surgical`) |
| GET  | `/api/blogs`, `/api/blogs/:slug` | Published blog posts (`?cat=Nutrition`) |
| GET  | `/api/testimonials` | Published testimonials |
| GET  | `/api/faqs` | Published FAQs (`?cat=Surgery`) |
| GET  | `/api/settings` | Contact details + homepage stats |
| GET  | `/api/pages/{home,about,achievements,results,contact}` | Page text and images (saved sections merged over `src/data/pageDefaults.json`) |
| POST | `/api/appointments` | Appointment form: `{ name, phone, email?, treatment?, date?, message? }` |
| POST | `/api/subscribers` | Newsletter signup: `{ email }` |

List endpoints support `?q=` search and `?page=&limit=` pagination.

### Auth
| Method | Path |
|---|---|
| POST | `/api/auth/login` — `{ email, password }` |
| POST | `/api/auth/logout` |
| GET  | `/api/auth/me` |
| PUT  | `/api/auth/change-password` — `{ currentPassword, newPassword }` |

### Admin (JWT required)
| Path | Methods | Roles |
|---|---|---|
| `/api/admin/dashboard` | GET | all |
| `/api/admin/uploads` | POST (multipart, field `file`: JPG/PNG/WebP/GIF, max 5 MB) → `{ url: "/uploads/..." }` | all |
| `/api/admin/pages/:key` (`home`, `about`, `achievements`, `results`, `contact`) | GET, PUT `{ section, data }` saves one section | all |
| `/api/admin/{treatments,blogs,testimonials,faqs}` | GET, POST (treatments: no POST) | all |
| `/api/admin/{treatments,blogs,testimonials,faqs}/:id` | GET, PUT, DELETE (treatments: no DELETE) | all |
| `/api/admin/appointments` (`?status=&q=`) | GET | superadmin, admin |
| `/api/admin/appointments/:id` | GET, PUT (`status`, `notes`), DELETE | superadmin, admin |
| `/api/admin/subscribers`, `/:id` | GET, DELETE | superadmin, admin |
| `/api/admin/settings` | GET (all), PUT (superadmin, admin) | |
| `/api/admin/admins`, `/:id` | GET, POST, PUT, DELETE | superadmin |

Appointment statuses: `new`, `contacted`, `confirmed`, `completed`, `cancelled`.

Uploaded images are stored in `uploads/` (git-ignored) and served at `/uploads/<file>`. Back this folder up, and on hosts with temporary disks (Render, Heroku, etc.) use a persistent disk.

Blog posts have a `content` field holding HTML from the admin's Quill editor. It is sanitized on save (scripts, event handlers and unknown iframes are removed; YouTube/Vimeo embeds are allowed). Older seeded posts use the plain `body` paragraphs until they are edited.

## Connecting the frontend

The frontend (`../mehul-vikani`) loads content from this API and posts the appointment and newsletter forms to it.

- **Development:** run this backend on port 5000 and `npm run dev` in the frontend. Vite proxies `/api` here, so no CORS setup is needed.
- **Production:** build the frontend with `VITE_API_URL=https://<your-backend>/api`, and add the site's origin to `CORS_ORIGINS` and set `SITE_URL` to the site address (used by the admin's "View website" link and image previews).
