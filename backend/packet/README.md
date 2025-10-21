# Offline NuGet package cache

This directory is reserved for NuGet packages that need to be restored without an
internet connection. Download the required packages on a machine with internet
access, copy the resulting `.nupkg` files into this folder, and then carry the
folder to the offline environment.

## Required packages

| Package ID | Version |
| --- | --- |
| `Microsoft.Extensions.DependencyInjection.Abstractions` | `8.0.0` |
| `Microsoft.Extensions.Http` | `8.0.0` |

A machine with the .NET SDK installed can download these packages with the
following commands (run from the repository root while online). They rely on
the [NuGet CLI](https://learn.microsoft.com/nuget/install-nuget-client-tools) (`nuget`):

```bash
nuget install Microsoft.Extensions.DependencyInjection.Abstractions -Version 8.0.0 -OutputDirectory backend/packet
nuget install Microsoft.Extensions.Http -Version 8.0.0 -OutputDirectory backend/packet
```

The [`manifest.json`](./manifest.json) file mirrors this table so automation can
verify the expected packages before a restore.

## Restoring packages offline

Once the `.nupkg` files are present in this directory on the offline machine,
use the provided NuGet configuration file to perform a restore using only the
local folder:

```bash
# From the repository root
DOTNET_OFFLINE_SOURCE=$(pwd)/backend/packet
dotnet restore backend/Portal.Backend.sln --configfile backend/packet/offline.nuget.config --source "$DOTNET_OFFLINE_SOURCE" --ignore-failed-sources
```

The `offline.nuget.config` file pins the available sources to the local cache,
while the explicit `--source` flag points the restore operation at the absolute
path for the current machine.

To ensure you start from a clean slate you can optionally clear the global NuGet
cache before the offline restore:

```bash
dotnet nuget locals all --clear
```

Afterwards you can remove the locally cached packages if they are no longer
required:

```bash
rm -rf "$DOTNET_OFFLINE_SOURCE"/*.nupkg
```
