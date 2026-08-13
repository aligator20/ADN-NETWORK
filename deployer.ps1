# Publie le site sur GitHub. Netlify prend ensuite le relais automatiquement.
#
# Usage (depuis n'importe ou) :
#   powershell -ExecutionPolicy Bypass -File "C:\Users\HP\Documents\INNOVATION TECH IA\adn-network\deployer.ps1"
#
# Le script demande l'URL du depot si elle n'est pas fournie.
#
# Aucun mot de passe n'est demande par ce script. Au premier `git push`, Git
# Credential Manager ouvre une fenetre de connexion GitHub dans le navigateur :
# authentification une seule fois, Windows retient ensuite le jeton.
#
# ATTENTION AUX ACCENTS : Windows PowerShell 5.1 lit les .ps1 en ANSI, pas en
# UTF-8. Un caractere accentue ou un tiret cadratin casse l'analyse du fichier.
# Ce script est donc volontairement en ASCII pur. Ne pas y ajouter d'accents.

param(
  [string]$RepoUrl
)

$ErrorActionPreference = 'Stop'
$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\nodejs;$env:PATH"
Set-Location $PSScriptRoot

if (-not $RepoUrl) {
  Write-Host ""
  Write-Host "URL du depot GitHub que tu viens de creer." -ForegroundColor Cyan
  Write-Host "Exemple : https://github.com/sylvere-adone/adn-network.git"
  $RepoUrl = Read-Host "URL"
}

$RepoUrl = $RepoUrl.Trim().TrimEnd('/')

if ($RepoUrl -match 'TON-COMPTE|<compte>|VOTRE') {
  throw "L'URL contient encore un espace reserve. Remplace-le par ton vrai pseudo GitHub."
}

# La barre d'adresse du navigateur donne l'URL SANS le suffixe .git, et c'est
# la forme que tout le monde copie. On accepte les deux et on normalise, plutot
# que de renvoyer une erreur sur une URL parfaitement valide.
if ($RepoUrl -match '^https://github\.com/([^/]+)/([^/]+?)(\.git)?$') {
  $RepoUrl = "https://github.com/$($Matches[1])/$($Matches[2]).git"
} else {
  throw "URL attendue : https://github.com/<pseudo>/<depot> - recu : $RepoUrl"
}

Write-Host ""
Write-Host ("Depot cible : {0}" -f $RepoUrl) -ForegroundColor Cyan

Write-Host ""
Write-Host "1/4  Verification du build" -ForegroundColor Cyan
npm run build | Out-Null
if (-not (Test-Path "out\index.html")) { throw "Le build n'a pas produit out\index.html" }
Write-Host ("     out/ genere : {0} fichiers" -f (Get-ChildItem "out" -Recurse -File).Count) -ForegroundColor Green

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
Write-Host "     Si une fenetre de connexion GitHub s'ouvre, connecte-toi." -ForegroundColor Yellow
Write-Host "     C'est normal et cela n'est demande qu'une seule fois." -ForegroundColor Yellow
Write-Host ""

$ErrorActionPreference = 'Continue'
git push -u origin main
$code = $LASTEXITCODE
$ErrorActionPreference = 'Stop'

Write-Host ""
if ($code -ne 0) {
  Write-Host "Le push a echoue (code $code)." -ForegroundColor Red
  Write-Host ""
  Write-Host "Causes les plus frequentes :" -ForegroundColor Yellow
  Write-Host "  - Le depot n'existe pas encore sur GitHub, ou son nom differe."
  Write-Host "  - Le depot a ete cree AVEC un README : il contient alors un commit"
  Write-Host "    que tu n'as pas en local. Dans ce cas, lance :"
  Write-Host "        git pull --rebase origin main"
  Write-Host "    puis relance ce script."
  Write-Host "  - La fenetre de connexion GitHub a ete fermee sans se connecter."
  exit $code
}

Write-Host "Termine. Le code est sur GitHub." -ForegroundColor Green
Write-Host ""
Write-Host "Il reste UNE etape, sur netlify.com :" -ForegroundColor Cyan
Write-Host "  Add new site  >  Import an existing project  >  GitHub  >  ce depot"
Write-Host "  Netlify lit netlify.toml : ne change ni la commande ni le dossier publie."
Write-Host ""
