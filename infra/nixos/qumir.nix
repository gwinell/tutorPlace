{ stdenv, fetchurl, cmake, ninja, pkg-config, llvmPackages_20, libffi, libxml2, readline, zlib, zstd }:

stdenv.mkDerivation {
  pname = "qumir";
  version = "1.0.6-40";

  src = fetchurl {
    url = "https://github.com/QumirLabs/qumir/archive/refs/tags/v1.0.6-40.tar.gz";
    sha256 = "a290892b27a9eeba61937719930e3e634cf00f1197d317e5af2bb3296f1ff3e2";
  };

  nativeBuildInputs = [ cmake ninja pkg-config llvmPackages_20.clang ];
  buildInputs = [ llvmPackages_20.llvm llvmPackages_20.lld libffi libxml2 readline zlib zstd ];

  cmakeFlags = [
    "-DQUMIR_BUILD_TESTS=OFF"
    "-DQUMIR_BUILD_SERVICE=OFF"
    "-DCMAKE_BUILD_TYPE=Release"
    "-DLLVM_DIR=${llvmPackages_20.llvm.dev}/lib/cmake/llvm"
    "-DCMAKE_C_COMPILER=${llvmPackages_20.clang}/bin/clang"
    "-DCMAKE_CXX_COMPILER=${llvmPackages_20.clang}/bin/clang++"
  ];

  doCheck = false;
}
