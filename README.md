
# 🤖 Chatbot Gemini avec FastAPI

Un chatbot intelligent propulsé par Google Gemini AI avec une API REST construite avec FastAPI et une interface web moderne.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)
![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Aperçu

Ce projet est un chatbot conversationnel intelligent qui utilise l'API Google Gemini pour générer des réponses contextuelles. Il comprend :

- **Backend API** : FastAPI avec gestion de l'historique des conversations
- **Frontend** : Interface web moderne et responsive avec Bootstrap 5
- **IA** : Google Gemini 2.5 Flash pour des réponses rapides et intelligentes

![Demo Screenshot](docs/screenshot.png)

## ✨ Fonctionnalités

- 💬 **Conversations contextuelles** : Le bot se souvient de l'historique des messages
- 🚀 **API REST** : Endpoints FastAPI documentés automatiquement
- 🎨 **Interface moderne** : UI responsive avec Bootstrap 5 et animations
- 🔄 **CORS configuré** : Compatible avec les applications frontend
- ⚡ **Performances** : Réponses rapides grâce à Gemini 2.5 Flash
- 📝 **Documentation automatique** : Swagger UI intégré
- 🛡️ **Gestion d'erreurs** : Validation des entrées et messages d'erreur clairs

## 🏗️ Architecture

```
┌─────────────┐      HTTP      ┌──────────────┐
│   Frontend  │ ───────────────>│   FastAPI    │
│   (HTML/JS) │                 │   Backend    │
└─────────────┘                 └──────────────┘
                                       │
                                       │ API Call
                                       ▼
                                ┌──────────────┐
                                │ Google Gemini│
                                │      AI      │
                                └──────────────┘
```

## 📦 Prérequis

- Python 3.9 ou supérieur
- Une clé API Google Gemini ([obtenir ici](https://aistudio.google.com/apikey))
- pip (gestionnaire de paquets Python)

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/chatbot-gemini-fastapi.git
cd chatbot-gemini-fastapi
```

### 2. Créer un environnement virtuel

```bash
# Linux/Mac
python3 -m venv .venv
source .venv/bin/activate

# Windows
python -m venv .venv
.venv\Scripts\activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Éditez `.env` et ajoutez votre clé API :

```env
GEMINI_API_KEY=votre_clé_api_ici
GEMINI_MODEL=gemini-2.5-flash
```

## ⚙️ Configuration

### Fichier `.env`

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `GEMINI_API_KEY` | Clé API Google Gemini | *Obligatoire* |
| `GEMINI_MODEL` | Modèle Gemini à utiliser | `gemini-2.5-flash` |

### Modèles disponibles

- `gemini-2.5-flash` : Rapide et économique (recommandé)
- `gemini-2.5-pro` : Plus puissant mais plus lent
- `gemini-flash-latest` : Dernière version stable

## 🎮 Utilisation

### Démarrer le serveur

```bash
uvicorn app.main:app --reload
```

Le serveur démarre sur `http://localhost:8000`

### Accéder à l'interface

1. **Interface web** : Ouvrez `frontend.html` dans votre navigateur
2. **API Docs** : [http://localhost:8000/docs](http://localhost:8000/docs)
3. **ReDoc** : [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Tester l'API avec curl

```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Bonjour, comment ça va ?"}'
```

## 📚 API Documentation

### Endpoints

#### POST `/api/chat`

Envoie un message au chatbot et reçoit une réponse.

**Request Body :**
```json
{
  "message": "Votre message ici"
}
```

**Response :**
```json
{
  "response": "Réponse du chatbot"
}
```

**Exemple avec Python :**
```python
import requests

response = requests.post(
    "http://localhost:8000/api/chat",
    json={"message": "Bonjour !"}
)

print(response.json()["response"])
```

**Exemple avec JavaScript :**
```javascript
fetch('http://localhost:8000/api/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        message: 'Bonjour !'
    })
})
.then(response => response.json())
.then(data => console.log(data.response));
```

#### GET `/`

Page d'accueil de l'API.

**Response :**
```json
{
  "message": "Chatbot API is running"
}
```

## 📁 Structure du projet

```
chatbot-gemini-fastapi/
│
├── app/
│   ├── __init__.py
│   ├── main.py                 # Point d'entrée FastAPI
│   ├── api/
│   │   ├── __init__.py
│   │   └── chat.py             # Routes de l'API
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py           # Configuration et settings
│   ├── memory/
│   │   ├── __init__.py
│   │   └── conversation.py     # Gestion de l'historique
│   ├── models/
│   │   ├── __init__.py
│   │   └── schema.py           # Modèles Pydantic
│   └── services/
│       ├── __init__.py
│       └── llm_services.py     # Logique Gemini AI
│
├── frontend.html               # Interface utilisateur
├── .env                        # Variables d'environnement (à créer)
├── .env.example                # Template pour .env
├── .gitignore                  # Fichiers à ignorer par Git
├── requirements.txt            # Dépendances Python
└── README.md                   # Ce fichier
```

## 🛠️ Technologies utilisées

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** - Framework web moderne et rapide
- **[Uvicorn](https://www.uvicorn.org/)** - Serveur ASGI haute performance
- **[Pydantic](https://pydantic-docs.helpmanual.io/)** - Validation des données
- **[Google Generative AI](https://ai.google.dev/)** - API Gemini

### Frontend
- **[Bootstrap 5](https://getbootstrap.com/)** - Framework CSS
- **[Bootstrap Icons](https://icons.getbootstrap.com/)** - Icônes
- **Vanilla JavaScript** - Pas de framework JS

### Outils
- **[Python-dotenv](https://github.com/theskumar/python-dotenv)** - Gestion des variables d'environnement

## 🔧 Développement

### Installer les dépendances de développement

```bash
pip install -r requirements-dev.txt
```

### Lancer les tests

```bash
pytest
```

### Format du code

```bash
black app/
isort app/
```

### Linting

```bash
flake8 app/
pylint app/
```

## 🐛 Dépannage

### Erreur : "API key not valid"

- Vérifiez que votre clé API est correcte dans le fichier `.env`
- Assurez-vous que la clé n'a pas été révoquée sur [Google AI Studio](https://aistudio.google.com/apikey)

### Erreur : "Model not found"

- Vérifiez que le nom du modèle dans `.env` est correct
- Utilisez `gemini-2.5-flash` au lieu de `gemini-1.5-flash`

### Erreur CORS dans le frontend

- Assurez-vous que le serveur backend est démarré
- Vérifiez que CORS est bien configuré dans `app/main.py`

### L'historique ne fonctionne pas

- L'historique est stocké en mémoire et sera perdu au redémarrage
- Pour une persistance, voir la section [Améliorations futures](#-améliorations-futures)

## 🚀 Déploiement

### Heroku

```bash
# Créer un Procfile
echo "web: uvicorn app.main:app --host=0.0.0.0 --port=${PORT:-8000}" > Procfile

# Déployer
heroku create votre-app-name
git push heroku main
heroku config:set GEMINI_API_KEY=votre_clé
```

### Docker

```dockerfile
# Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build et run
docker build -t chatbot-gemini .
docker run -p 8000:8000 --env-file .env chatbot-gemini
```

## 🎨 Personnalisation

### Changer le modèle Gemini

Dans `.env` :
```env
GEMINI_MODEL=gemini-2.5-pro  # Modèle plus puissant
```

### Modifier les paramètres de génération

Dans `app/services/llm_services.py` :
```python
generation_config=genai.types.GenerationConfig(
    max_output_tokens=2000,    # Longueur max de la réponse
    temperature=0.9,           # Créativité (0-2)
    top_p=0.95,               # Diversité
)
```

### Personnaliser l'interface

Modifiez `frontend.html` :
- Couleurs : Changez le gradient dans le CSS
- Texte : Modifiez le titre et le message de bienvenue
- Icônes : Utilisez d'autres icônes de Bootstrap Icons

## 🌟 Améliorations futures

- [ ] 💾 Persistance avec base de données (SQLite/PostgreSQL)
- [ ] 👤 Système d'authentification utilisateur
- [ ] 📊 Dashboard d'analytics
- [ ] 🎤 Support de la reconnaissance vocale
- [ ] 🖼️ Support des images avec Gemini Vision
- [ ] 🌍 Internationalisation (i18n)
- [ ] 🔄 Streaming de réponses
- [ ] 📱 Application mobile React Native
- [ ] 🎨 Personnalités multiples du bot
- [ ] 📤 Export de conversations

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Guidelines de contribution

- Suivez le style de code existant (PEP 8)
- Ajoutez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation si nécessaire
- Assurez-vous que tous les tests passent

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**David** - [@votre-username](https://github.com/votre-username)

## 🙏 Remerciements

- [Google](https://google.com) pour l'API Gemini
- [FastAPI](https://fastapi.tiangolo.com/) pour le framework
- [Bootstrap](https://getbootstrap.com/) pour l'interface
- La communauté open source

## 📞 Contact

- GitHub : [@votre-username](https://github.com/votre-username)
- Email : votre.email@example.com
- LinkedIn : [Votre Profil](https://linkedin.com/in/votre-profil)

## ⭐ Star History

Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile ⭐

---

**Fait avec ❤️ et Python**
