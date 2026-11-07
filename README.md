# SSM Multi Services — devises de recherche

Le formulaire de recherche permet d’afficher les prix en EUR, USD, XOF, CDF (franc congolais) et GBP. La devise choisie est transmise au fournisseur de vols et le prix est formaté dans la devise renvoyée par celui-ci.

La prise en charge effective de CDF dépend de l’API de vols et du compte fournisseur. Le choix CDF ne constitue pas une conversion garantie : si le fournisseur ne prend pas cette devise en charge, il peut refuser la recherche. Aucun taux de change n’est inventé côté navigateur.

Le mode test Amadeus utilise des données limitées/cachées et ne garantit pas de tarifs en temps réel. Pour des prix réels, un accès production fournisseur est nécessaire. Les fonctions de réservation, paiement et commission restent désactivées.
