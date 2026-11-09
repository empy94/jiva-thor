# Jiva Thor — aperçu expérimental

Application Android pour jouer à Jiva en ligne sur un appareil à deux écrans. Le jeu reste sur l'écran principal ; le second écran propose quatre onglets : sorts, objets, carte et chat. Le site est privé et chaque joueur doit disposer d'un accès. Aucun identifiant ou mot de passe n'est inclus.

La carte reprend les tuiles et les repères visibles dans le jeu ; le déplacement au doigt, le pincement et le double toucher permettent de l’explorer et de la recentrer. Sa netteté reste limitée par les images fournies par le jeu. Les points de vie, PA, PM et kamas sont lus depuis l'interface du jeu. Les raccourcis favoris sont configurables avec le bouton « + » : les sorts et objets proposés sont ceux présents dans la barre correspondante du jeu. Les favoris restent enregistrés sur l'appareil. Le chat affiche les couleurs et les filtres des canaux du jeu ; les filtres peuvent être modifiés depuis le second écran. L’envoi de messages reste dans le jeu. Les messages ne sont pas envoyés vers un autre service.

La détection de combat repose sur les boutons visibles du jeu et doit encore être vérifiée en combat. Les conseils restent limités aux indicateurs disponibles ; l'application ne calcule pas de stratégie complète. Une partie des commandes de manette est expérimentale et le ciblage des cases repose encore sur le tactile ou un curseur. Le jeu exige une connexion Internet.

## Commandes expérimentales

- L2 / R2 : choisir un sort de la barre du jeu.
- Stick gauche ou croix : déplacer le curseur ; A : toucher.
- X : inventaire ; Y : carte du monde ; L1 : caractéristiques ; R1 : sorts ; B ou Start : retour. SELECT tente de terminer le tour en combat.

Les commandes et le ciblage demandent une validation physique en jeu. Les icônes et cartes sont chargées depuis Jiva après authentification ; les ressources du jeu ne sont pas incluses dans ce dépôt.

## Construction

Windows, JDK 19, Android SDK platform 35 et build-tools 34.0.0 :

```powershell
.\build.ps1 -Sdk 'CHEMIN_VERS_ANDROID_SDK' -Jdk 'CHEMIN_VERS_JDK'
```

Le fichier produit est `build/Jiva-Thor.apk`. Une clé locale de signature est créée dans le profil de l'utilisateur et n'est pas incluse dans le dépôt. Conserver cette clé pour installer les mises à jour signées sur le même appareil.
