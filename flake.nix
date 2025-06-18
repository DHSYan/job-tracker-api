{
  inputs = {
    nixpkgs = { url = "github:NixOS/nixpkgs/nixpkgs-unstable"; };
    flake-utils = { url = "github:numtide/flake-utils"; };
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.permittedInsecurePackages = [ "openssl-1.1.1w" ];
        };
        lib = nixpkgs.lib;
      in {
        devShell = pkgs.mkShell {
          MONGOMS_DISTRO = "ubuntu-22.04";
          NIX_LD_LIBRARY_PATH = lib.makeLibraryPath
            (with pkgs; [ stdenv.cc.cc openssl_1_1 curlFull ]);
          NIX_LD =
            builtins.readFile "${pkgs.stdenv.cc}/nix-support/dynamic-linker";
        };
      });
}
