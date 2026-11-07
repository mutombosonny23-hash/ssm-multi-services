# SSM Multi Services — Dashboard et aperçu de réservation

Application web responsive de démonstration pour la gestion de réservations aériennes et le suivi indicatif des commissions.

## Aperçu

La page de réservation est `public/booking.html`. Après déploiement GitHub Pages, ouvrez `https://mutombosonny23-hash.github.io/ssm-multi-services/booking.html` si Pages est activé. En local, lancez `npm install` puis `npm run dev`, et ouvrez `http://localhost:5173/booking.html`.

## Paiements affichés dans la maquette

La page propose maintenant Visa, Airtel Money, M-Pesa et Orange Money. L’écran ne collecte aucune donnée de carte ou code Mobile Money et ne traite aucun paiement. Pour accepter des paiements réels, il faut sélectionner des prestataires agréés compatibles avec les pays concernés et intégrer leurs parcours hébergés/API côté serveur. Les commissions estimées sont indicatives et ne remplacent pas un accord commercial.

## Recherche de vols

Le projet inclut un serveur Express pour la recherche Amadeus. Pour l’utiliser : copiez `.env.example` vers `.env`, renseignez les clés Amadeus côté serveur, lancez `npm run server` et `npm run dev`. Les résultats de démonstration ne sont pas des tarifs réservables.

## Limites importantes

L’aperçu ne crée pas de réservation, n’émet pas de billet, ne traite pas de paiement et ne crée pas de commission réelle. Une mise en production exige l’accès de production du fournisseur de vols, les API de tarification/réservation/émission, des accords commerciaux, l’authentification, un prestataire de paiement conforme et une configuration serveur sécurisée.
