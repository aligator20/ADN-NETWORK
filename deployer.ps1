# Publie le site sur GitHub, puis Netlify prend le relais automatiquement.
#
# Usage :
#   powershell -ExecutionPolicy Bypass -File deployer.ps1 https://github.com/<toi>/adn-network.git
#
# Ce script ne demande aucun mot de passe. Au premier `git push`, Git Credential
# Manager ouvre une fenêtre de connexion GitHub dans ton navigateur : tu
# t'authentifies une seule fois, Windows retient le jeton, et les fois
# suivantes le push est immédiat.

param(
  [Parameter(Mandatory = $true, HelpMessage = "URL du dépôt GitHub, finissant par .git")]
  [string]$RepoUrl
)

$ErrorActionPreference = 'Stop'
$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\nodejs;$env:PATH"
Set-Location $PSScriptRoot

if ($RepoUrl -notmatch '^https://github\.com/.+/.+\.git$') {
  throw "URL attendue de la forme https://github.com/<compte>/<depot>.git — reçu : $RepoUrl"
}

Write-Host ""
Write-Host "1/4  Verification du build" -ForegroundColor Cyan
npm run build | Out-Null
if (-not (Test-Path "out\index.html")) { throw "Le build n'a pas produit out\index.html" }
$n = (Get-ChildItem "out" -Recurse -File).Count
Write-Host "     out/ genere : $n fichiers" -ForegroundColor Green

Write-Host ""
Write-Host "2/4  Commit des changements en attente" -ForegroundColor Cyan
if (git status --porcelain) {
  git add -A
  git commit -m "Prepare le deploiement" | Out-Null
  Write-Host "     changements commites" -ForegroundColor Green
} else {
  Write-Host "     rien a commiter, arbre propre" -ForegroundColor Green
}

Write-Host ""
Write-Host "3/4  Configuration du depot distant" -ForegroundColor Cyan
if (git remote | Select-String -Quiet '^origin$') {
  git remote set-url origin $RepoUrl
  Write-Host "     origin mis a jour" -ForegroundColor Green
} else {
  git remote add origin $RepoUrl
  Write-Host "     origin ajoute" -ForegroundColor Green
}

Write-Host ""
Write-Host "4/4  Envoi vers GitHub" -ForegroundColor Cyan
Write-Host "     Si une fenetre de connexion GitHub s'ouvre, connecte-toi : c'est normal," -ForegroundColor Yellow
Write-Host "     et cela ne sera demande qu'une seule fois." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "Termine. Le code est sur GitHub." -ForegroundColor Green
Write-Host ""
Write-Host "Il reste UNE etape, sur netlify.com :" -ForegroundColor Cyan
Write-Host "  Add new site  ->  Import an existing project  ->  GitHub  ->  ce depot"
Write-Host "  Netlify lit netlify.toml : ne change ni la commande ni le dossier publie."
Write-Host ""
