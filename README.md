# SSM Multi Services — Réservation aérienne

La page `public/booking.html` propose aller simple/aller-retour, dates de voyage, nombre d’adultes (13 ans et plus), nombre d’enfants et âge de chaque enfant (0–12 ans). En aller-retour, le calendrier de retour est affiché et requis. La recherche transmet `returnDate` et `children` à l’API Amadeus; la limite de la maquette est de 9 voyageurs au total.

Le logo de l’en-tête est agrandi et effectue une rotation de 360° toutes les 5,5 secondes. L’animation est désactivée si le système demande une réduction des animations.

Visa, Airtel Money, M-Pesa et Orange Money sont visibles comme choix de démonstration seulement. Aucun paiement, billet ou commission réelle n’est traité. Les résultats de secours sont fictifs.

Lancer en local : `npm install`, puis `npm run dev`, ouvrir `http://localhost:5173/booking.html`. La recherche Amadeus demande un fichier `.env` avec les secrets côté serveur et `npm run server` dans un autre terminal.
