# 🗣️💥 Contact — Le jeu de mots vocal avec un Maître IA

Le jeu **Contact** sur téléphone (iPhone **et** Android), pensé pour se jouer **à l'oral, à plusieurs (2 à 6 joueurs)** autour d'un seul téléphone posé au milieu de la table. Le téléphone incarne le **Maître du Mot** : une IA (Claude) qui choisit un mot secret, **écoute vos indices au micro**, essaie de vous **couper**, et **parle à voix haute** grâce à la synthèse vocale.

C'est une **PWA** (Progressive Web App) : une simple page web, installable sur l'écran d'accueil en 10 secondes. Zéro framework — toute la logique tient dans `index.html`.

**Et c'est aussi une vraie app native** 📱 : le projet embarque **Capacitor** avec les projets Android (`android/`) et iOS (`ios/`) déjà générés, plugins vocaux natifs inclus. Pour publier sur **Google Play et l'App Store**, suis le guide pas-à-pas : **[GUIDE-STORES.md](GUIDE-STORES.md)**. Un workflow GitHub Actions construit même un **APK Android téléchargeable** à chaque push.

---

## 🎮 Les règles (version app)

1. Le Maître IA choisit un **mot secret** et annonce sa **première lettre** (ex. « C »).
2. Un joueur pense à un mot commençant par les lettres révélées et donne un **indice à voix haute** aux autres joueurs (« C'est un animal qui ronronne » 🐱).
3. Si un autre joueur pense avoir trouvé, il crie **« Contact ! »**.
4. Le joueur qui a donné l'indice appuie sur 🎙️ et **répète son indice au téléphone** : le Maître IA tente de deviner le mot pour crier **« Coupé ! »**.
   - L'IA trouve → indice grillé, rien ne se passe.
   - L'IA se trompe → les deux joueurs comptent « 3, 2, 1 » et disent leur mot en même temps. Même mot ? **Le Maître révèle une lettre de plus !**
5. À tout moment, on peut tenter le **mot secret complet** (🎯). Les joueurs gagnent s'ils le trouvent (ou si toutes les lettres sont révélées) ; le Maître gagne s'ils abandonnent.

---

## 🚀 Mettre le jeu sur vos téléphones (le plus rapide)

### Option A — GitHub Pages (recommandé, ~2 minutes)

1. Sur GitHub : **Settings → Pages → Source : GitHub Actions**.
2. Poussez ce code sur la branche `main` (le workflow `.github/workflows/pages.yml` déploie automatiquement).
3. Ouvrez l'URL `https://<votre-compte>.github.io/Contact/` sur chaque téléphone.
4. Installez l'app :
   - **iPhone (Safari)** : bouton Partager → **« Sur l'écran d'accueil »**.
   - **Android (Chrome)** : menu ⋮ → **« Ajouter à l'écran d'accueil »** / « Installer l'application ».

> ⚠️ La reconnaissance vocale et le micro nécessitent du **HTTPS** — GitHub Pages le fournit d'office.

### Option B — Test local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

(En local, le micro fonctionne sur `localhost` ; sur un téléphone du même réseau il faudra du HTTPS.)

---

## 🤖 Activer le Maître IA

1. Créez une clé API sur [console.anthropic.com](https://console.anthropic.com) (→ API Keys).
2. Dans l'app : **⚙️ Réglages & IA** → collez la clé → **Tester la connexion**.
3. La clé est stockée **uniquement dans le navigateur du téléphone** (localStorage), jamais envoyée ailleurs qu'à l'API Anthropic.

- Modèle par défaut : **Claude Opus 4.8** (le plus malin). Passez sur **Haiku 4.5** dans les réglages pour des réponses plus rapides et moins chères.
- Coût : quelques centimes par partie au maximum (requêtes très courtes).

**Sans clé API**, l'app fonctionne en **mode arbitre** : elle choisit le mot secret, gère les lettres, les comptes à rebours et les contacts — mais ne coupe pas vos indices.

---

## 🧱 Techno (volontairement minimale)

| Besoin | Solution |
|---|---|
| iPhone + Android sans App Store | **PWA** (HTML/CSS/JS pur, un seul fichier) |
| Le Maître écoute les indices | **Web Speech API** (`SpeechRecognition`, fr-FR) + saisie clavier en secours |
| Le Maître parle | **Synthèse vocale** (`speechSynthesis`, voix française) |
| Le cerveau du Maître | **API Claude** (appel direct depuis le navigateur, sorties structurées JSON) |
| Hors-ligne / démarrage instantané | Service worker (`sw.js`) + manifest |

### Fichiers

```
index.html            ← toute l'app (UI + logique + appels IA)
manifest.webmanifest  ← installation sur l'écran d'accueil
sw.js                 ← cache hors-ligne
icons/                ← icônes de l'app
.github/workflows/pages.yml ← déploiement GitHub Pages automatique
```

### Notes de compatibilité

- **Synthèse vocale** : fonctionne partout (iOS Safari, Chrome Android).
- **Reconnaissance vocale** : Chrome Android ✅ · Safari iOS ✅ (iOS 14.5+, nécessite Siri/Dictée activée). Si indisponible, l'app propose automatiquement la saisie au clavier.
- La clé API dans le navigateur convient à un usage **perso/entre amis**. Pour une mise en ligne publique, il faudrait un petit proxy serveur pour cacher la clé.
