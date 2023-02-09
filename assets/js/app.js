
// on objet qui contient des fonctions
var app = {

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');
    app.addListenerToActions();
  },

  addListenerToActions: function(){
    // Event sur le bouton "Ajouter une liste"
    const addListButton = document.getElementById('addListButton');
    addListButton.addEventListener('click', app.showAddListModal);

    // Event sur les boutons "Fermer les modales"
    const closeModalButtons = document.querySelectorAll(".close");
    for(const button of closeModalButtons){
      button.addEventListener('click', app.hideModals);
    }

    // Event sur le formulaire "ajouter une liste"
    const addListForm = document.querySelector("#addListModal form");
    addListForm.addEventListener('submit', app.handleAddListForm);

    // boutons "ajouter une carte"
    const addCardButtons = document.querySelectorAll('.button--add-card');
    for (const button of addCardButtons) {
      button.addEventListener('click', app.showAddCardModal);
    }

    // formulaire "ajouter une carte"
    const addCardForm = document.querySelector('#addCardModal form');
    addCardForm.addEventListener('submit', app.handleAddCardForm);
  },

  showAddListModal: function(){
    const modal = document.getElementById("addListModal");
    modal.classList.add('is-active');
  },

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

  hideModals: function(){
    const modals = document.querySelectorAll(".modal");
    for (const modal of modals) {
      modal.classList.remove("is-active");
    }
  },

  handleAddListForm: function(event) {
    /**Une fois le formulaire soumit, je veux effectuer le traitement nécessaire
     * Plan d'action :
     * 1.On coupe le comportement par défaut de l'évenement (ici le refresh de la page)
     * 2.Récupérer les infos des inputs du formulaire
     * 3. on appelle la méthode de création (ajout dans le DOM) en lui passant le formData
     * 4. Fermer la modale
     * 5. On reset le contenu du formulaire
     */
    event.preventDefault();
    const formData = new FormData(event.target);
    app.makeListInDOM(formData);
    app.hideModals();
    event.target.reset();


  },

  // action formulaire : ajouter une carte
  handleAddCardForm: function (event) {
    // on empeche le rechargement de la page
    event.preventDefault();
    // on récupère les infos du form
    const formData = new FormData(event.target);
    // on appelle la méthode de création en lui passant le formData
    app.makeCardInDOM(formData);
    // on ferme les modales
    app.hideModals();
    // on reset le contenu du formulaire
    event.target.reset();
  },

  makeListInDOM: function(formData){
    // Récupérer le template
    const template = document.getElementById("list-template");
    // Cloner le template
    const newList = document.importNode(template.content, true);
    //console.log(newList);
    //Je veux ajouter un titre dans le h2 à ma liste
    newList.querySelector("h2").textContent = formData.get("name");

    // Je veux ajouter un identifiant unique a une liste
    const listId = "list-" + Date.now(); //Date.now() équivaut à un timestamp. Il s'exprime en nombre de millisecondes depuis le 1er janvier 1970
    // Je veux rajouter cet identifiant à deux endroits dans ma liste
    //Le premier endroit, ca sera dans le premier node de newList, dans data-list-id
    newList.querySelector('.panel').dataset.listId = listId;
    // => Utiliser ce console log pour bien comprendre l'histoire du dataset
    //console.log(newList.querySelector('.panel').dataset);

    // On rajoute l'id dans le deuxième endroit : le input hidden
    newList.querySelector("form input[name='list-id']").value = listId;
    console.log(newList);
    // On rajoute un eventListener au bouton "+" de chaque liste nouvellement créée
    newList.querySelector(".button--add-card").addEventListener('click', app.showAddCardModal)


    //Insérer la nouvelle liste en premiere position
    const listContainer = document.querySelector("#listContainer");
    const firstList = listContainer.querySelector(".panel"); //Désigne la premiere liste dans listContainer
    if(firstList){
      firstList.before(newList);
    } else {
      listContainer.appendChild(newList);
    }
  },

  makeCardInDOM: function (formData) {
    // récupérer le template
    const template = document.getElementById('template-card');
    // créer une nouvelle copie
    const newCard = document.importNode(template.content, true);
    // changer les valeurs qui vont bien
    newCard.querySelector('.card-name').textContent = formData.get('title');

    // on ajoute un id unique a la carte, Date.now() est le timestamp (nombre de milliseconde depuis le 01/01/1970) il change donc à chaque milliseconde
    const cardId = 'card-' + Date.now();
    newCard.querySelector('.box').dataset.cardId = cardId;

    // insérer la nouvelle carte dans la bonne liste
    const theGoodList = document.querySelector(`[data-list-id="${formData.get('list_id')}"]`);
    theGoodList.querySelector('.panel-block').appendChild(newCard);
  }

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );