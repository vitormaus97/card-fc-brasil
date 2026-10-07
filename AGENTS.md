<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Prototype architecture

- Keep catalog cards, variants, and physical copies as separate typed entities; a print run belongs to a variant, while serial, photos, condition, grading, and price belong to a copy.
- Keep demo data and local mutations in the shared demo provider, separate from presentation; this allows replacing local persistence with a repository backed by the user's future database.
- Persist only demo state in sessionStorage after hydration; the user explicitly requested local behavior without cloud services or authentication.
- Give each primary screen its own TanStack route and leaf metadata; this preserves navigable, shareable URLs and prepares future data loading.
- Use global semantic theme tokens and reusable design-system controls; this keeps the mobile and desktop experience consistent.
