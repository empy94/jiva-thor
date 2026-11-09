param([Parameter(Mandatory=$true)][string]$Sdk,[Parameter(Mandatory=$true)][string]$Jdk)
$ErrorActionPreference='Stop'
$root=$PSScriptRoot; $bt=Join-Path $Sdk 'build-tools\34.0.0'; $jar=Join-Path $Sdk 'platforms\android-35\android.jar'; $out=Join-Path $root 'build'
New-Item -ItemType Directory -Force -Path "$out\gen","$out\classes","$out\dex" | Out-Null
& "$bt\aapt.exe" package -f -m -M "$root\AndroidManifest.xml" -S "$root\res" -A "$root\assets" -I $jar -J "$out\gen" -F "$out\unsigned.apk"
if($LASTEXITCODE){throw 'Packaging failed'}
$sources=@(Get-ChildItem "$root\src","$out\gen" -Recurse -Filter '*.java' | ForEach-Object FullName)
& "$Jdk\bin\javac.exe" --release 8 -encoding UTF-8 -classpath $jar -d "$out\classes" $sources
if($LASTEXITCODE){throw 'Compilation failed'}
& "$Jdk\bin\jar.exe" cf "$out\classes.jar" -C "$out\classes" .
& "$bt\d8.bat" --lib $jar --min-api 28 --output "$out\dex" "$out\classes.jar"
if($LASTEXITCODE){throw 'Dex failed'}
Push-Location "$out\dex"; try { & "$bt\aapt.exe" add "$out\unsigned.apk" classes.dex } finally { Pop-Location }
if($LASTEXITCODE){throw 'APK failed'}
& "$bt\zipalign.exe" -f 4 "$out\unsigned.apk" "$out\aligned.apk"
if($LASTEXITCODE){throw 'Alignment failed'}
$keyDir=Join-Path $env:USERPROFILE '.android\jiva-thor'; New-Item -ItemType Directory -Force $keyDir | Out-Null
$key=Join-Path $keyDir 'local.jks'; $pass=Join-Path $keyDir 'password.txt'
if(!(Test-Path $key)){if(Test-Path $pass){throw 'Password exists without key'};$b=New-Object byte[] 32;[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b);[IO.File]::WriteAllText($pass,[Convert]::ToBase64String($b)); & "$Jdk\bin\keytool.exe" -genkeypair -keystore $key -storepass:file $pass -keypass:file $pass -alias jiva -dname 'CN=Jiva Thor Local' -keyalg RSA -keysize 3072 -validity 10000;if($LASTEXITCODE){throw 'Key generation failed'}}
& "$bt\apksigner.bat" sign --ks $key --ks-key-alias jiva --ks-pass "file:$pass" --out "$out\Jiva-Thor.apk" "$out\aligned.apk"
if($LASTEXITCODE){throw 'Signing failed'}
& "$bt\apksigner.bat" verify "$out\Jiva-Thor.apk"
if($LASTEXITCODE){throw 'Verification failed'}
