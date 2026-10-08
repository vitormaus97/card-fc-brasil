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
- Keep illustrative marketplace listings in the demo provider and private accounts/favorites in authenticated server functions and a separate query provider; demo state must never seed user accounts.
- Persist only illustrative marketplace session state in sessionStorage after hydration; private records belong to the connected database.
- Give each primary screen its own TanStack route and leaf metadata; this preserves navigable, shareable URLs and prepares future data loading.
- Use global semantic theme tokens and reusable design-system controls; this keeps the mobile and desktop experience consistent.
- Keep purchased_collection separate from physical seller inventory and orders; only trusted fulfillment after received-order validation can populate purchased cards.
- Keep private screens under the client-only authenticated layout and public catalog routes ungated; server functions validate bearer identity independently.
- Version schema, grants, RLS and lifecycle triggers in migrations; app components must not own database operations.
