# Jiva Thor — aperçu expérimental

Application Android pour jouer à Jiva en ligne sur un appareil à deux écrans. Le jeu reste sur l’écran principal ; le second écran réunit les sorts, les objets, la carte et le chat. Le site est privé : chaque joueur doit disposer de son propre accès. Aucun identifiant ou mot de passe n’est inclus.

## Second écran

- Les points de vie, PA, PM et kamas reprennent les icônes et les informations visibles dans le jeu.
- Les onglets Sorts et Objets proposent des favoris personnalisables avec le bouton « + », une recherche et les icônes du jeu. Le catalogue présente les sorts appris et les objets du sac accessibles au personnage. Pour le lire, l’application peut ouvrir temporairement le livre de sorts ou le sac sur l’écran principal, puis referme les fenêtres qu’elle a ouvertes.
- **Limite actuelle :** pour utiliser un favori depuis le second écran, il doit aussi figurer dans la barre correspondante du jeu. Les éléments qui n’y figurent pas sont signalés dans la liste. Les favoris restent enregistrés sur l’appareil.
- La carte reprend les tuiles et repères visibles dans le jeu ; le déplacement au doigt, le pincement et le double toucher permettent de l’explorer et de la recentrer. Sa netteté reste limitée par les images fournies par le jeu.
- Le chat reprend les couleurs et filtres des canaux ; les filtres sont modifiables sur le second écran. L’envoi reste dans le jeu. Les messages ne sont pas transmis à un autre service par le compagnon.

Le passage en mode combat repose sur les éléments visibles du jeu. Les informations affichées ne constituent pas un calcul complet de stratégie. Les fonctionnalités en combat demandent encore une validation en situation réelle. Le jeu exige une connexion Internet.

Les icônes et cartes sont chargées depuis Jiva après authentification ; les ressources du jeu ne sont pas incluses dans ce dépôt. Les pistes de collaboration pour le second écran figurent dans [les idées pour le développeur](docs/IDEES_SECOND_ECRAN.md).

## Construction

Windows, JDK 19, Android SDK platform 35 et build-tools 34.0.0 :

```powershell
.\build.ps1 -Sdk 'CHEMIN_VERS_ANDROID_SDK' -Jdk 'CHEMIN_VERS_JDK'
```

Le fichier produit est `build/Jiva-Thor.apk`. Une clé locale de signature est créée dans le profil de l’utilisateur et n’est pas incluse dans le dépôt. Conserver cette clé pour installer les mises à jour signées sur le même appareil.
