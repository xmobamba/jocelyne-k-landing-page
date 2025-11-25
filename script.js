document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES GLOBALES INITIALES ---
    let currentProductName = "Lunettes de Soleil Miroir Rouge Édition"; 
    let currentProductPrice = "12 000 FCFA";
    const whatsappNumber = '22508481012'; 

    // --- ÉLÉMENTS DU DOM À METTRE À JOUR ---
    const mainImage = document.getElementById('mainImage');
    const mainPrice = document.getElementById('mainPrice');
    const mainTitle = document.getElementById('mainTitle');
    const mainDescription = document.getElementById('mainDescription');
    const productCard = document.getElementById('mainProductCard');
    const mainReviewsList = document.getElementById('mainReviewsList'); // Élément conteneur des avis
    const averageRatingSpan = document.getElementById('averageRating');

    // --- DONNÉES INITIALES POUR LE PREMIER PRODUIT (Miroir Rouge) ---
    // On doit charger les avis du premier produit au démarrage
    const initialReviews = [
        {"name": "Aïcha K. (Cocody)", "text": "Elles sont magnifiques ! La livraison a été super rapide. Je recommande.", "rating": 5},
        {"name": "Marc-André D.", "text": "Qualité top, le rendu miroir rouge est incroyable en vrai.", "rating": 5}
    ];

    // --- FONCTION POUR GÉNÉRER LES ÉTOILES ---
    function generateStars(rating) {
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                starsHtml += '<i class="fas fa-star" style="color: #FFB400;"></i>';
            } else {
                starsHtml += '<i class="far fa-star" style="color: #FFB400;"></i>';
            }
        }
        return starsHtml;
    }

    // --- FONCTION POUR METTRE À JOUR LA LISTE DES AVIS ---
    function updateReviews(reviewsDataStr) {
        // 1. Convertir la chaîne JSON des attributs data en objet Javascript
        const reviews = JSON.parse(reviewsDataStr);
        
        // 2. Vider la liste actuelle
        mainReviewsList.innerHTML = '';
        
        let totalRating = 0;

        // 3. Créer le HTML pour chaque nouvel avis
        reviews.forEach(review => {
            totalRating += review.rating;
            const reviewHtml = `
                <div class="review-item" style="background-color: var(--input-bg); padding: 15px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05); margin-bottom: 10px;">
                    <div class="review-header" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span class="reviewer-name" style="font-weight: 700; color: var(--primary-text);">${review.name}</span>
                        <div class="review-stars">${generateStars(review.rating)}</div>
                    </div>
                    <div class="review-text" style="font-style: italic; color: var(--secondary-text);">${review.text}</div>
                </div>
            `;
            // 4. Ajouter le HTML à la liste
            mainReviewsList.innerHTML += reviewHtml;
        });

        // 5. Mettre à jour la note moyenne globale (Optionnel)
        const avg = (totalRating / reviews.length).toFixed(1);
        if(averageRatingSpan) {
             averageRatingSpan.innerHTML = `${avg}/5 <i class="fas fa-star"></i>`;
        }
    }

    // --- CHARGEMENT INITIAL DES AVIS ---
    // On convertit le tableau initial en chaîne JSON pour utiliser la même fonction
    updateReviews(JSON.stringify(initialReviews));


    // --- GESTION DU CARROUSEL INTERACTIF ---
    const clickableCards = document.querySelectorAll('.clickable-product');

    clickableCards.forEach(card => {
        card.addEventListener('click', function() {
            // Récupérer toutes les données
            const newName = this.getAttribute('data-name');
            const newPrice = this.getAttribute('data-price');
            const newImg = this.getAttribute('data-img');
            const newDesc = this.getAttribute('data-desc');
            const newReviewsData = this.getAttribute('data-reviews'); // Récupérer les avis

            // Animation de transition
            productCard.style.opacity = '0.5';

            setTimeout(() => {
                // Mise à jour des infos principales
                mainImage.src = newImg;
                // On utilise une astuce pour remettre la couleur d'accent sur la deuxième partie du titre
                const titleParts = newName.split(' ');
                const firstPart = titleParts.shift(); // Le premier mot
                const restPart = titleParts.join(' '); // Le reste
                mainTitle.innerHTML = `${firstPart} <br><span class="accent-text">${restPart}</span>`;
                
                mainPrice.textContent = newPrice;
                mainDescription.textContent = newDesc;

                // MISE À JOUR DES AVIS
                updateReviews(newReviewsData);

                // Mise à jour des variables pour le formulaire
                currentProductName = newName;
                currentProductPrice = newPrice;

                productCard.style.opacity = '1';
                
                // Remonter en haut de page
                window.scrollTo({ top: 0, behavior: 'smooth' });

            }, 200);
        });
    });

    // --- GESTION DU FORMULAIRE (Inchangé) ---
    const orderForm = document.getElementById('orderForm');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const deliveryAddressInput = document.getElementById('deliveryAddress');

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!phoneNumberInput.value.trim() || !deliveryAddressInput.value.trim()) {
            orderForm.classList.add('shake');
            setTimeout(() => orderForm.classList.remove('shake'), 500);
            return;
        }
        
        const clientPhone = phoneNumberInput.value.trim();
        const clientAddress = deliveryAddressInput.value.trim();

        const message = 
`*NOUVELLE COMMANDE* 🕶️

*Produit :* ${currentProductName}
*Prix :* ${currentProductPrice}

------------------

*📞 Contact :* ${clientPhone}
*📍 Livraison à :* ${clientAddress}

Merci de confirmer la commande.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        window.location.href = whatsappUrl;
    });

    // --- ACCORDÉON (Inchangé) ---
    const details = document.querySelector('details');
    const summaryIcon = document.querySelector('summary i');
    if(details && summaryIcon) {
        details.addEventListener('toggle', () => {
            if (details.open) {
                summaryIcon.classList.remove('fa-chevron-down');
                summaryIcon.classList.add('fa-chevron-up');
            } else {
                summaryIcon.classList.remove('fa-chevron-up');
                summaryIcon.classList.add('fa-chevron-down');
            }
        });
    }
});
