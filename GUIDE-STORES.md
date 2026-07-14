# 📱 Publier Contact sur l'App Store et Google Play

Le projet est **prêt pour les stores** : la web app (`index.html`) est emballée dans une vraie app native avec **Capacitor**. Les projets natifs sont déjà générés et configurés :

```
android/   ← projet Android Studio (Gradle), permission micro OK, icônes OK
ios/       ← projet Xcode (CocoaPods), permissions micro + reconnaissance vocale OK, icônes OK
www/       ← généré par `npm run build` (ne pas éditer, ne pas committer)
```

Dans l'app native, la voix passe par des **plugins natifs** (`@capacitor-community/speech-recognition` et `text-to-speech`) — le code bascule tout seul entre navigateur et natif.

> 💰 **Comptes développeur requis (c'est la seule vraie barrière)**
> - **Google Play** : 25 $ une seule fois — [play.google.com/console](https://play.google.com/console)
> - **Apple** : 99 $/an — [developer.apple.com](https://developer.apple.com) (+ un Mac avec Xcode, ou un service de build cloud type Codemagic)

---

## 🤖 Google Play (Android)

### Étape 0 — APK de test sans rien installer

Le workflow GitHub Actions **« Build APK Android »** construit un APK de debug à chaque push (ou à la demande, onglet *Actions* → *Run workflow*). Télécharge l'artefact `contact-debug-apk` et installe-le directement sur un téléphone Android : parfait pour tester avec tes amis avant même de passer par le store.

### Étape 1 — Préparer le build signé (release)

```bash
npm install
npm run build          # copie la web app dans www/
npx cap sync android   # synchronise www/ et les plugins dans android/
npx cap open android   # ouvre Android Studio
```

Dans Android Studio :
1. **Build → Generate Signed App Bundle** → créer un **keystore** (garde-le précieusement : il est irremplaçable) → produire le fichier **`.aab`**.

### Étape 2 — Play Console

1. Crée l'application (nom : *Contact — Le jeu de mots*, langue : français).
2. Remplis la fiche : description, icône 512 px (`assets/icon.png`), captures d'écran (fais-les depuis l'app), questionnaire de classification du contenu, **sécurité des données** (l'app ne collecte rien ; la clé API reste sur l'appareil ; les indices vocaux sont envoyés à l'API Anthropic pour la partie).
3. Téléverse le `.aab`.

> ⚠️ **Nouveau compte personnel Google Play** : Google impose d'abord un **test fermé avec ~12 testeurs pendant 14 jours** avant de pouvoir publier en production. Prévois cette étape (invite tes amis, ils testeront le jeu en avant-première 🙂).

Délai de review : de quelques heures à quelques jours.

---

## 🍎 App Store (iPhone)

Il faut un **Mac** (ou un service cloud : Codemagic, Ionic Appflow, Xcode Cloud).

```bash
npm install
npm run build
npx cap sync ios       # lance aussi `pod install`
npx cap open ios       # ouvre Xcode (App.xcworkspace)
```

Dans Xcode :
1. Cible **App** → *Signing & Capabilities* → sélectionne ta **Team** (compte développeur) ; le bundle ID est `fr.camcarre.contact` (modifiable dans `capacitor.config.json` + Xcode).
2. Branche un iPhone et lance ▶️ pour tester en réel.
3. **Product → Archive** → *Distribute App* → **App Store Connect**.

Dans [App Store Connect](https://appstoreconnect.apple.com) :
1. Crée l'app, remplis la fiche (description FR, captures d'écran iPhone, catégorie *Jeux → Mots*).
2. Déclare la confidentialité : micro utilisé pour le jeu, aucune donnée collectée par toi (les indices transitent par l'API Anthropic).
3. Teste via **TestFlight** (invitations par simple lien — idéal pour tes 6 joueurs), puis **soumets à la review** (~1 à 3 jours).

---

## 🔁 Mettre à jour l'app après un changement

```bash
# modifie index.html, puis :
npm run build && npx cap sync
# rebuild dans Android Studio / Xcode, incrémente la version, re-soumets
```

- Android : `versionCode`/`versionName` dans `android/app/build.gradle`
- iOS : *Version*/*Build* dans Xcode

---

## 🧭 Récap des chemins possibles

| Objectif | Solution | Délai | Coût |
|---|---|---|---|
| Jouer ce soir | **PWA** (GitHub Pages + « Ajouter à l'écran d'accueil ») | 2 min | 0 € |
| Tester en vraie app Android | **APK debug** du workflow GitHub Actions | 5 min | 0 € |
| Bêta iPhone entre amis | **TestFlight** | 1 jour | 99 $/an |
| Sur Google Play | `.aab` signé + Play Console | qq jours (+ test fermé 14 j si nouveau compte) | 25 $ |
| Sur l'App Store | Archive Xcode + review Apple | qq jours | 99 $/an |
