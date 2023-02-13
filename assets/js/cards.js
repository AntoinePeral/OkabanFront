const cardModule = {

    // affiche la modale "créer une carte"
  showAddCardModal: function (event) {
    // event.target contient la cible du click
    const listElement = event.target.closest('.panel');
    // on récupère l'id de la liste cible
    const listId = listElement.dataset.listId;

    const modal = document.getElementById('addCardModal');
    // on récupère l'input 
    const input = modal.querySelector('input[name="list_id"]');
    // on change sa valeur
    input.value = listId;
    // on a plus qu'à afficher la modale
    modal.classList.add('is-active');
  },

  // action formulaire : ajouter une carte
  handleAddCardForm: async function (event) {
    /**Une fois le formulaire de création de carte soumis, je veux effectuer ce traitement
     * Plan d'action :
     * 1. on empeche le rechargement de la page 
     * 2. on récupère les infos du form
     * 3. On veut enregistrer la nouvelle Card dans la BDD
     * 4. on appelle la méthode de création en lui passant le formData
     * 5. on ferme les modales
     * 6. on reset le contenu du formulaire
     */
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await fetch(`${utilModule.base_url}/cards`, {
        method: 'POST',
        body: formData
      });
      const jsonData = await response.json();
      if(!response.ok) { throw new Error("Impossible de créer la carte !")}
      cardModule.makeCardInDOM(jsonData);
    } catch (error) {
      alert(error);
      console.log(error);
    }
    utilModule.hideModals();
    event.target.reset();
  },

  makeCardInDOM: function (card) {
    // récupérer le template
    const template = document.getElementById('template-card');
    // créer une nouvelle copie
    const newCard = document.importNode(template.content, true);
    // changer les valeurs qui vont bien
    newCard.querySelector('.card-name').textContent = card.title;
    const cardDOM = newCard.querySelector(".box");
    newCard.querySelector(".box").dataset.cardId = card.id;
    newCard.querySelector("form input[name='card-id']").value = card.id;

    newCard.querySelector(".box").style.backgroundColor = card.color;
    newCard.querySelector('input[name="color"]').value = card.color;

    
    newCard.querySelector(".edit-card-icon").addEventListener("click", cardModule.showEditCardForm);
    newCard.querySelector(".edit-card-form").addEventListener("submit", cardModule.handleEditCardForm);
    newCard.querySelector(".delete-card-icon").addEventListener("click", cardModule.deleteCard );
    // insérer la nouvelle carte dans la bonne liste
    const theGoodList = document.querySelector(`[data-list-id="${card.list_id}"]`);
    theGoodList.querySelector('.panel-block').appendChild(newCard);
  },

  showEditCardForm: function(event) {
    /** Je veux afficher le formulaire d'édition de carte */ 
    //Je me repositionne sur la div de la card
    const cardDOM = event.target.closest('.box');
    // Je sélectionne le nom de la carte et je le cache
    cardDOM.querySelector('.card-name').classList.add("is-hidden");
    // Je veux afficher le formulaire
    cardDOM.querySelector(".edit-card-form").classList.remove("is-hidden");
  },

  handleEditCardForm: async function(event) {
    // On coupe le rechargement de la page (comportement par défaut d'un form);
    event.preventDefault();
    // On extrait les données du formulaire grâce à la classe FormData
    const formData = new FormData(event.target);
    // On selectionne le titre de la carte
    const cardTitle = event.target.previousElementSibling;

    try {
      // On appelle l'API via la route /cards/:id en mode PUT
      const response = await fetch(`${utilModule.base_url}/cards/${formData.get('card-id')}`, {
        method: 'PUT',
        body: formData
      });
      // On récupère la data (la liste modifiée ou l'erreur)
      const jsonData = await response.json();
      // Si la réponse n'est pas ok, on créé une nouvelle erreur, qui sera récupérée directement par le catch
      if(!response.ok) { throw new Error("Impossible d'éditer la carte !")}

      //Je veux modifiere le titre de la liste dans le DOM
      cardTitle.textContent = jsonData.title;
      event.target.closest(".box").style.backgroundColor = jsonData.color;
      
    } catch (error) {
      console.log(error);
      alert(error);
    }
    // On cache le formulaire (quelque soit le résultat du traitement)
    event.target.classList.add('is-hidden');
    cardTitle.classList.remove('is-hidden');

  },

  deleteCard: async function(event){
    // On récupère la carte dans le DOM
    const cardDOM = event.target.closest('.box');

    // On fait le call à l'API pour supprimer la carte en question
    try {
      const response = await fetch(`${utilModule.base_url}/cards/${cardDOM.dataset.cardId}`, {
        method: 'DELETE'
      });
      // On récupère la réponse de la db (si c'est ok, elle nous envoie une string qui dit "OK")
      const jsonData = await response.json();

      if (!response.ok) { throw new Error("Impossible de supprimer la carte !") }
      // On supprime la carte du DOM
      cardDOM.remove();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

}