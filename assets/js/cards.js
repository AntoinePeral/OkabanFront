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

    newCard.querySelector('.box').dataset.cardId = card.id;

    newCard.querySelector('.box').style.backgroundColor = card.color;

    // insérer la nouvelle carte dans la bonne liste
    const theGoodList = document.querySelector(`[data-list-id="${card.list_id}"]`);
    theGoodList.querySelector('.panel-block').appendChild(newCard);
  },
}