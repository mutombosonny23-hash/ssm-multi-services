# SSM Multi Services — recherche de vols

La page `public/booking.html` propose l’autocomplétion des villes/aéroports avec nom et code IATA via Amadeus, et un filtre pour Air Congo (4V), Brussels Airlines (SN), Air France (AF), Ethiopian Airlines (ET) et Kenya Airways (KQ). Les codes exacts sont transmis au fournisseur pour filtrer les offres disponibles.

## Limitation test / temps réel

Le mode test Amadeus sert au développement et ne garantit pas de tarifs ni de disponibilité en temps réel : les jeux de données et compagnies/routes retournés sont limités ou mis en cache. Aucune connexion directe aux sites grand public des compagnies n’est incluse. Pour les tarifs réellement à jour, il faut obtenir l’accès production Amadeus ou un accès API/accord commercial direct de chaque compagnie ou agrégateur. Même avec l’accès production, la couverture dépend des flux et accords du fournisseur.

## Lancer localement

1. Installer Node.js 18+ et lancer `npm install`.
2. Copier `.env.example` vers `.env`, puis ajouter les identifiants Amadeus. Ne jamais publier les secrets.
3. Lancer l’API avec `npm run server` et l’interface avec `npm run dev` dans deux terminaux.
4. Ouvrir `http://localhost:5173/booking.html`.

Les API du serveur sont `GET /api/locations?keyword=Paris`, `GET /api/flights/status` et `GET /api/flights/search`. En mode test, les résultats obtenus restent des données de test; la page ne remplace pas un prix manquant par un tarif fictif présenté comme réel. La réservation, émission de billet, paiement et commission de production ne sont pas activés.
