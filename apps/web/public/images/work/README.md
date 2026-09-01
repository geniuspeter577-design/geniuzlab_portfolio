# /public/images/work/

Real project images go here, one folder per category slug (matching
`lib/categories.ts`):

```
work/
├── graphic-design/
├── church-christian/
├── branding-identity/
├── social-media/
├── posters-flyers/
├── motion-video/
└── client-projects/
```

Suggested convention per project: `work/<category>/<project-slug>/cover.jpg`
plus `01.jpg`, `02.jpg`, … for gallery images. Once real files are added,
update the matching entry in `lib/projects.ts` to point `coverImage`/`gallery`
at these paths instead of `/images/placeholder.svg`.
