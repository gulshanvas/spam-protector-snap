# Airstack snap protector repo

This repository demonstrates how to develop a snap with TypeScript. For detailed
instructions, see [the MetaMask documentation](https://docs.metamask.io/guide/snaps.html#serving-a-snap-to-your-local-environment).

MetaMask Snaps is a system that allows anyone to safely expand the capabilities
of MetaMask. A _snap_ is a program that we run in an isolated environment that
can customize the wallet experience.

# Rules of Spam protector snap powered by Airstack Apis
Rules are broadly categorized into below groups :
1. Already transferred (user A to B) : It means sender already has transfer history with receiver
2. User strongly follow each other :  It means if user A is following user B on socials like farcaster and lens and satisfies any one of the rule amongst Common POAP events attended, Common followers on Lens or Farcaster, Has lens profile(To Address), Has farcaster account(To Address), Has primary ENS(To Address)
3. Token transfer from : It states that the `receiver` address has sent tokens to `sender` and satisfies any one of the rule amongst Common POAP events attended, Common followers on Lens or Farcaster, Has lens profile(To Address), Has farcaster account(To Address), Has primary ENS(To Address).
4. Common followers on Lens or Farcaster
5. Common POAP events attended (non-virtual)

Each time a category of rules is satisfied, score is incremented. If the score is 0, then no match is there and user is asked to `Stay Cautious` while transacting with the receiver. If the score is 1, then it is said to be `Connected` and anything greater than 1 is `strongly connected`

## Snaps is pre-release software

To interact with (your) Snaps, you will need to install [MetaMask Flask](https://metamask.io/flask/),
a canary distribution for developers that provides access to upcoming features.

## Getting Started

Clone the spam-protector-snap repository [using this template](https://github.com/gulshanvas/spam-protector-snap)
and set up the development environment:

```shell
yarn install && yarn start
```

## Cloning

This repository contains GitHub Actions that you may find useful, see
`.github/workflows` and [Releasing & Publishing](https://github.com/MetaMask/template-snap-monorepo/edit/main/README.md#releasing--publishing)
below for more information.

If you clone or create this repository outside the MetaMask GitHub organization,
you probably want to run `./scripts/cleanup.sh` to remove some files that will
not work properly outside the MetaMask GitHub organization.

If you don't wish to use any of the existing GitHub actions in this repository,
simply delete the `.github/workflows` directory.

## Contributing

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and
fix any automatically fixable issues.

### Using NPM packages with scripts

Scripts are disabled by default for security reasons. If you need to use NPM
packages with scripts, you can run `yarn allow-scripts auto`, and enable the
script in the `lavamoat.allowScripts` section of `package.json`.

See the documentation for [@lavamoat/allow-scripts](https://github.com/LavaMoat/LavaMoat/tree/main/packages/allow-scripts)
for more information.
# spam-protector-snap
