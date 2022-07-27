# Station Module Configuration

- Status: ACCEPTED

## Context

Station modules want to allow Station users to tweak certain aspects of their
runtime behaviour.

For example, Saturn L2 Node lets users control how much disk space they are
willing to offer for the cache.

This configuration is module-specific. Each module has different options.

The Station communicates the configuration to the Module via environment
variables passed to the module backend process.

## Options Considered

### (1) Each module provides config WebUI

The initial idea was to let each Station Module implement its configuration
screen as part of the module WebUI and persist the configuration in a file. The
Station would provide the directory where to keep the config file.

We quickly realised this was not optimal. The Saturn module is written in Go and
expects users to provide all configuration options via environment variables in
the spirit of [The Twelve-Factor App](https://12factor.net). Implementing a
configuration layer with GUI requires a lot of work inside Saturn L2 that's not
adding much value to Saturn:

1. A REST API to read & write the configuration from the WebUI.
2. Code to persist the configuration in a file. Also, handle possible conflicts
   between the config file and environment variables.
3. The config editor GUI.
4. Support for changing configuration options at runtime with zero downtime.

### (2) Module provides config schema; Station provides configuration WebUI

A different approach is to mimic what VisualStudio Code offers to extensions:

- Modules provide schema describing their configuration, and
- Station builds a configuration GUI based on the module-provided schema.

This creates a value proposition offered by the Station to future Module
authors: modules don't have to implement a user-friendly configuration GUI; the
Station will provide it for free.

There are some caveats, though. Supporting complex configuration formats is a
lot of work. VS Code has been evolving the configuration editor for years, and
there are still edge cases where the user has to edit the configuration in the
JSON file.

Some edge cases to consider:

- A config option is an array of primitive values (an array of strings, an array
  of numbers)
- A config option is an enum - there is a set of valid values to pick from.
- Combine 1+2, and we have an array of enum values.
- A config option is an object (a key-value map). In some cases, sub-options are
  well defined - we know what the valid keys are and what value types each key
  accepts. In other cases, this can be entirely dynamic.

## Decision

We have decided to implement the second option, where the Station provides the
configuration GUI for Modules.

We will start by supporting:

- string keys mapped directly to environment variables
- string or integer values
- optional and required config options
- string descriptions of config options

We will implement support for more complex configurations later.

To keep our config schema easy to extend and forward-compatible, it should be a
superset of
[JSON Schema](https://json-schema.org/understanding-json-schema/reference/index.html).

## Consequences

The configuration WebUI will be consistent across all modules and follow the
Station visual style.

Developers in the Filecoin ecosystem have another incentive to deploy their app
to Filecoin Station - we will take care of user-friendly configuration
management.

In the future, we may need to spend some development cycles adding support for
more complex configuration schemes.

Config schema evolution is another area to explore after the initial release.
How can a module rename a config key, add a new config option, or update a
default value?

## Links &amp; References

- [VS Code reference for extensions contributing configuration](https://code.visualstudio.com/api/references/contribution-points#contributes.configuration)
