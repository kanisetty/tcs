@echo off
Rem
Rem Copyright  (C) 1985-2010 Intel Corporation. All rights reserved.
Rem
Rem The information and source code contained herein is the exclusive property
Rem of Intel Corporation and may not be disclosed, examined, or reproduced in
Rem whole or in part without explicit written authorization from the Company.
Rem

Rem Intel(R) C++ Intel(R) 64 C++ Compiler Professional Build Environment for applications running on Intel(R) 64 

echo.
echo Intel(R) C++ Intel(R) 64 Compiler Professional for applications running on Intel(R) 64, Version 11.1.070
echo Copyright (C) 1985-2010 Intel Corporation. All rights reserved.
echo.

if {%1} EQU {vs2008} (
    @call "C:\Program Files (x86)\Microsoft Visual Studio 9.0\VC\vcvarsall.bat" x64
) else (
if {%1} EQU {vs2005} (
    @call "C:\Program Files (x86)\Microsoft Visual Studio 8\VC\vcvarsall.bat" x64
    ) else (
    @call "C:\Program Files (x86)\Microsoft Visual Studio 9.0\VC\vcvarsall.bat" x64
    )
)
title Intel(R) C++ Intel(R) 64 Compiler Professional for applications running on Intel(R) 64, Version 11.1.070 build environment

echo.

SET ICPP_COMPILER11=C:\Program Files (x86)\Intel\Compiler\11.1\070
SET INTEL_LICENSE_FILE=C:\Program Files (x86)\Common Files\Intel\Licenses;%INTEL_LICENSE_FILE%
SET PATH=%ICPP_COMPILER11%\Bin\intel64;%PATH%
SET LIB=%ICPP_COMPILER11%\Lib\intel64;%LIB%
SET INCLUDE=%ICPP_COMPILER11%\Include;%INCLUDE%
