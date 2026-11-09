# Jiva Thor — aperçu expérimental

Application Android pour accéder au site Jiva en ligne sur un appareil à deux écrans. L'écran principal affiche le jeu ; le second présente un carnet et des commandes de manette. Le site est privé : chaque utilisateur doit disposer de son propre accès. Aucune donnée de connexion n'est incluse dans le projet.

## État du projet

Il s'agit d'une première version, pas d'un assistant complet. Le carnet lit les indicateurs visibles du jeu : points de vie, points d'action, points de mouvement et sorts affichés. Le second écran propose des boutons pour choisir un sort, ouvrir l'inventaire ou le journal et terminer un tour. Il présente les objets du sac, leurs effets sélectionnés, les pods et les textes visibles du journal. Le mode automatique reconnaît l'ouverture du journal et de l'inventaire et tente de détecter un combat grâce à ses boutons. Les conseils tactiques avancés restent à développer. La reconnaissance des combats, le lancer de sorts depuis le panneau et les commandes physiques doivent encore être testés en situation.

Le jeu reste dépendant du site et d'une connexion Internet. Le carnet utilise une icône chargée directement depuis le site, après authentification ; les ressources du jeu ne sont pas incluses dans ce dépôt.

## Commandes prévues

- L2 / R2 : sélectionner un sort ; stick gauche ou croix : déplacer un curseur ; A : toucher.
- X : inventaire ; Y : journal de quêtes ; L1 : caractéristiques ; R1 : sorts ; B ou Start : retour.
- Le tactile reste utilisable. Le ciblage des cases repose pour l'instant sur un curseur ou le tactile ; une navigation complète à la manette reste à développer. Les commandes peuvent varier selon le mode de la manette et nécessitent une validation physique.

## Construction

Windows, JDK 19, Android SDK platform 35 et build-tools 34.0.0 :

```powershell
.\build.ps1 -Sdk 'CHEMIN_VERS_ANDROID_SDK' -Jdk 'CHEMIN_VERS_JDK'
```

Le fichier produit est `build/Jiva-Thor.apk`. Une clé locale de signature est créée dans le profil de l'utilisateur et n'est pas incluse dans le dépôt. Conserver cette clé pour installer les mises à jour signées sur le même appareil.

## Confidentialité

Le carnet lit uniquement quelques éléments affichés par la page et ne transmet pas ces données à un autre service. La connexion au jeu s'effectue auprès de Jiva. L'application ne contient ni mot de passe ni compte préconfiguré.
