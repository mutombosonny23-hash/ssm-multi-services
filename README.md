# SSM Multi Services — Dashboard premium

Application web responsive de démonstration pour la gestion de réservations aériennes et le suivi de commissions.

## Démarrer

1. Installer Node.js 18 ou supérieur.
2. Installer les dépendances : `npm install`
3. Copier `.env.example` vers `.env` et renseigner les identifiants obtenus dans le compte Amadeus for Developers. Ne partagez jamais le secret API dans le navigateur, le dépôt GitHub ou une conversation.
4. Lancer l’API dans un terminal : `npm run server`
5. Lancer l’interface dans un autre terminal : `npm run dev`
6. Ouvrir la page de recherche à `http://localhost:5173/flight-search.html`.

Le serveur utilise par défaut l’environnement de test Amadeus. Pour la production, définissez `AMADEUS_ENV=production` après obtention de l’accès de production. Les identifiants restent côté serveur. Les paramètres de recherche acceptent des codes d’aéroport/villes IATA (ex. CDG, DSS), une date, un nombre d’adultes et une devise.

## Intégration incluse

- API serveur Express : `GET /api/flights/search` et `GET /api/flights/status`
- Authentification OAuth2 Amadeus avec mise en cache du jeton
- Recherche d’offres de vols via Flight Offers Search
- Interface responsive avec résultats, durée, escales, compagnie et prix
- Validations des données et erreurs en français

## Limites importantes

L’intégration actuelle connecte la recherche à Amadeus uniquement. Elle ne donne pas accès automatiquement à toutes les compagnies. Les compagnies et tarifs disponibles dépendent de la couverture du fournisseur et de votre contrat. L’application ne crée pas encore de réservation, n’encaisse pas de paiement et ne verse pas de commission. La vente réelle demande les API de tarification/réservation/émission, un compte de production approuvé, les accords commerciaux et une intégration sécurisée des paiements. Les indicateurs du dashboard restent des données de démonstration.
