## ExpressJs BackEnd Commands

```sh
# Install dependencies
npm install
```
Then you can begin development:

```sh
# npm
npm run dev
```

This will launch a [nodemon](https://nodemon.io/) process for automatic server restarts when your code changes.

### Deployment

Deployment is specific to hosting platform/provider but generally:

```sh
# npm
npm run build
```

will compile your `src` into `/dist`, and 

```sh
# npm
npm start
```

will run `build` (via the `prestart` hook) and start the compiled application from the `/dist` folder.

The last command is generally what most hosting providers use to start your application when deployed, so it should take care of everything.

#endpoints


* GET /

* GET /transactions

* GET /transactions/{id}

* POST /transactions
  ```json
  {
    "type": string,  // "credit" | "debit"
    "amount": float  // positive value
  }
  ```
