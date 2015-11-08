@ECHO OFF
IF "%2"=="test" (
  ECHO grunt dist
  grunt dist
  ECHO AzCopy
  AzCopy\AzCopy.exe /Source:..\FrontendApplication\FrontendApplication\assets\%1 /Dest:https://cxatestportal.blob.core.windows.net/website/%1 /DestKey:THzOmysz5k9lB3yljO5JG4R0QuY6rdkB+L8fvRpqrsCMkzzJ3wq8pGlj1trsh38syc+wCnxQZso9Al2XWRjTFA== /S /Y /SetContentType /XO
) ELSE IF "%2"=="demo" (
  ECHO grunt dist
  grunt dist
  ECHO AzCopy
  AzCopy\AzCopy.exe /Source:..\FrontendApplication\FrontendApplication\assets\%1 /Dest:https://cxademo.blob.core.windows.net/website/%1 /DestKey:E7CMoE39xbnsWppTnR++PzWDdmDTC3JtJ/ucCU/rtv9sx44eGUBJIYZKh5hW5Ax19KOkdUW0n2Hoa4ch60KFHw== /S /Y /SetContentType /XO
) ELSE IF "%2"=="prod" (
  ECHO grunt dist
  grunt dist
  ECHO AzCopy
  AzCopy\AzCopy.exe /Source:..\FrontendApplication\FrontendApplication\assets\%1 /Dest:https://cxaprod.blob.core.windows.net/website/%1 /DestKey:qqF/lSjvgyQInz5deRTYDvPSCPk8nnOEgziAYGFobEVTajngjEucOFO4esc33U685qDVCgHgao5wsc+GEdLl0w== /S /Y /SetContentType /XO
)

