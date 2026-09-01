Cloning from https://github.com/geniuspeter577-design/geniuzlab_portfolio
==> Checking out commit ae864bdee6b0fb0fd779b9ca50ac3e0629453df4 in branch main
==> Using Node.js version 24.14.1 (default)
==> Docs on specifying a Node.js version: https://render.com/docs/node-version
==> Running build command 'npm install; npm run build'...
added 736 packages, and audited 739 packages in 11s
138 packages are looking for funding
  run `npm fund` for details
3 high severity vulnerabilities
To address all issues (including breaking changes), run:
  npm audit fix --force
Run `npm audit` for details.
> @geniuzlab/backend@1.0.0 build
> tsc
src/admin-projects.ts(3,37): error TS2307: Cannot find module '@/lib/auth' or its corresponding type declarations.
src/admin-projects.ts(4,51): error TS2307: Cannot find module '@/lib/categories' or its corresponding type declarations.
src/admin-projects.ts(54,47): error TS7006: Parameter 'category' implicitly has an 'any' type.
src/admin-projects.ts(62,29): error TS7006: Parameter 'category' implicitly has an 'any' type.
src/admin-projects.ts(112,33): error TS2339: Property 'category' does not exist on type 'never'.
src/admin-projects.ts(120,12): error TS2339: Property 'projectCategory' does not exist on type 'never'.
src/admin-projects.ts(121,27): error TS7006: Parameter 'category' implicitly has an 'any' type.
src/admin-projects.ts(141,10): error TS2339: Property 'tag' does not exist on type 'never'.
src/admin-projects.ts(149,12): error TS2339: Property 'projectTag' does not exist on type 'never'.
src/admin-projects.ts(150,27): error TS7006: Parameter 'tag' implicitly has an 'any' type.
src/admin-projects.ts(189,12): error TS2339: Property 'projectImage' does not exist on type 'never'.
src/admin-projects.ts(216,24): error TS7006: Parameter 'project' implicitly has an 'any' type.
src/admin-projects.ts(217,45): error TS7006: Parameter 'image' implicitly has an 'any' type.
src/admin-projects.ts(231,45): error TS7031: Binding element 'category' implicitly has an 'any' type.
src/admin-projects.ts(235,33): error TS7031: Binding element 'tag' implicitly has an 'any' type.
src/admin-projects.ts(266,46): error TS7031: Binding element 'category' implicitly has an 'any' type.
src/admin-projects.ts(267,31): error TS7031: Binding element 'tag' implicitly has an 'any' type.
src/admin-projects.ts(268,38): error TS7006: Parameter 'image' implicitly has an 'any' type.
src/admin-projects.ts(270,37): error TS7006: Parameter 'image' implicitly has an 'any' type.
src/admin-projects.ts(271,41): error TS7006: Parameter 'image' implicitly has an 'any' type.
src/admin-projects.ts(275,16): error TS7006: Parameter 'image' implicitly has an 'any' type.
src/admin-projects.ts(276,13): error TS7006: Parameter 'image' implicitly has an 'any' type.
src/admin-projects.ts(306,33): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/admin-projects.ts(307,27): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/admin-projects.ts(308,29): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/admin-projects.ts(320,36): error TS7006: Parameter 'tx' implicitly has an 'any' type.
src/admin-projects.ts(341,35): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/admin-projects.ts(342,29): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/admin-projects.ts(343,31): error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.
src/auth/auth.ts(1,22): error TS2307: Cannot find module '@/auth' or its corresponding type declarations.
src/projects.ts(1,30): error TS2307: Cannot find module './types' or its corresponding type declarations.
npm error Lifecycle script `build` failed with error:
npm error code 2
npm error path /opt/render/project/src/apps/backend
npm error workspace @geniuzlab/backend@1.0.0
npm error location /opt/render/project/src/apps/backend
npm error command failed
npm error command sh -c tsc
==> Build failed 😞
==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys