# Station module interface

1. A module itself is a long-running executable, which
    - performs its business logic
    - writes informative messages to `stdio`
    - exposes stats via a builtin webserver

1. A module needs to have its __binaries hosted__ on HTTPS accessible URLs, so that Station can download updates. Path patterns are flexible, GitHub Releases would be nice.

    Example:
    ```
    https://github.com/filecoin-saturn/L2-node/releases
    ```

1. A module should run on as many operating systems as possible, without requiring any prior setup before executing its binary. On macOS, x86 is required, arm64 nice to have.

2. A module can provide a custom __command string__ for launching its executable. Ideally a module doesn't require any extra arguments when launching.

    Example:
    ```bash
    $ bacalhau # ideal
    $ bacalhau --foo=bar
    ```

3. A module's executable gets passed the following environment variables:
    - `FIL_WALLET_ADDRESS` The user's Filecoin wallet address
    - `ROOT_DIR` The long-lived working directory on disk. The module must store
      all of its files inside (subdirectories of) this directory. The directory
      isn't expected to be backed up or shared across machines in any way.

    Example:
    ```bash
    $ FIL_WALLET_ADDRESS=f1... ROOT_DIR=/var/bacalhau bacalhau
    ```

4. A module communicates activity by writing to its `stdout` stream:
    - `API: $1` The module has launched and `$1` can be queried for fetching module stats (see below)
    - `INFO: $1` `$1` will be displayed to the user inside Station's Activity Log
    - `ERROR: $1` `$1` will be displayed to the user inside Station's Activity Log, with a warning icon
    - `$1` all log lines will be stored in a module-specific log file, which can be submitted to Sentry for error handling

5. A module is expected to have provided its `API` URL in `<=500ms`

6. A module's `stderr` will be stored in the same module-specific log file as its `stdout`, to be used for post-mortem debugging.

7. A module exposes its stats via HTTP(S), on an address communicated via
`stdout` (see above `API:`). The response will be a JSON object with at least
the following fields:

    ```json
    {
      "jobsCompleted": 1234
    }
    ```

    The number of jobs completed is expected to be a monotonically increasing
    number. It's the responsibility of the module to persist this number across
    process restarts, somewhere in `ROOT_DIR`.
    
    The module may include additional fields in the JSON response, although
    these will be ignored by Station.

7. A module can be told to shut down via signal `SIGTERM`

8. A module can shut down at any time, which is always considered an error. Its exit will be shown in Station's UI, and the last 100 lines of its output streams forwarded to Sentry. The module won't automatically be restarted by Station (for now).
