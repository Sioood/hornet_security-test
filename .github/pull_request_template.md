## Summary

<!-- 1-3 bullet points describing what this PR does and WHY -->

-

## Type of change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Refactor (no functional changes)
- [ ] Documentation
- [ ] CI/CD / tooling

## Breaking changes

<!-- If this is a breaking change, describe the impact and migration path -->

N/A

## Testing checklist

- [ ] Unit tests pass (`pnpm test`)
- [ ] New logic covered by unit tests
- [ ] Component tests pass (if UI changes)
- [ ] E2E tests pass (if user-facing flow changes)
- [ ] Mutation testing reviewed (`pnpm mutation`) for critical logic
- [ ] Visual regression screenshots updated (if applicable)

## Review checklist

- [ ] Types are strict (no `any`, discriminated unions used where applicable)
- [ ] No commented-out code or dead imports
- [ ] i18n keys added/updated for user-facing text
- [ ] Accessibility: semantic HTML, ARIA attributes, keyboard navigation
- [ ] Performance: no unnecessary re-renders, lazy loading where appropriate
- [ ] Security: inputs validated, no secrets in code

## Related issues

<!-- Link issues: Closes #123, Fixes #456 -->
