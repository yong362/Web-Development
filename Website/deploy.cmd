@ECHO OFF
IF "%1"=="test" (
  ECHO git checkout master
  git checkout master
  ECHO git pull origin
  git pull origin
  ECHO git push origin
  git push origin
  ECHO grunt dist
  grunt dist
  ECHO AzCopy
  AzCopy\AzCopy.exe /Source:..\FrontendApplication\FrontendApplication\assets /Dest:https://cxatestportal.blob.core.windows.net/website /DestKey:THzOmysz5k9lB3yljO5JG4R0QuY6rdkB+L8fvRpqrsCMkzzJ3wq8pGlj1trsh38syc+wCnxQZso9Al2XWRjTFA== /S /Y /SetContentType /XO
) ELSE IF "%1"=="demo" (
  IF "%2"=="merge" (
    ECHO git checkout master
    git checkout master
    ECHO git pull origin
    git pull origin
  )
  ECHO git checkout demo
  git checkout demo
  ECHO git pull origin
  git pull origin
  IF "%2"=="merge" (
    ECHO git merge master
    git merge master
  )
  ECHO git push origin
  git push origin
  ECHO grunt dist
  grunt dist
  ECHO AzCopy
  AzCopy\AzCopy.exe /Source:..\FrontendApplication\FrontendApplication\assets /Dest:https://cxademo.blob.core.windows.net/website /DestKey:E7CMoE39xbnsWppTnR++PzWDdmDTC3JtJ/ucCU/rtv9sx44eGUBJIYZKh5hW5Ax19KOkdUW0n2Hoa4ch60KFHw== /S /Y /SetContentType /XO
) ELSE IF "%1"=="prod" (
  IF "%2"=="merge" (
    ECHO git checkout master
    git checkout master
    ECHO git pull origin
    git pull origin
  )
  ECHO git checkout production
  git checkout production
  ECHO git pull origin
  git pull origin
  IF "%2"=="merge" (
    ECHO git merge master
    git merge master
  )
  ECHO git push origin
  git push origin
  ECHO grunt dist
  grunt dist
  ECHO AzCopy
  AzCopy\AzCopy.exe /Source:..\FrontendApplication\FrontendApplication\assets /Dest:https://cxaprod.blob.core.windows.net/website /DestKey:qqF/lSjvgyQInz5deRTYDvPSCPk8nnOEgziAYGFobEVTajngjEucOFO4esc33U685qDVCgHgao5wsc+GEdLl0w== /S /Y /SetContentType /XO
)

