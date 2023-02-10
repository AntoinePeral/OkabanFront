
// on objet qui contient des fonctions
var app = {

  base_url: "http://localhost:3000",

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');
    app.addListenerToActions();
    app.getListsFromAPI();
  },

  addListenerToActions: function(){
    /** On veut ajouter des écouteurs (eventListeners) sur chaque action (submit, click)
     * Plan d'action pour chaque évenement
     * 1. Sélectionner l'élément actionnable 
     * 2. Ajouter un écouteur selon le besoin, et lancer une action en retour
     */
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

  handleAddListForm: async function(event) {
    /**Une fois le formulaire soumit, je veux effectuer le traitement nécessaire
     * Plan d'action :
     * 1. On coupe le comportement par défaut de l'évenement (ici le refresh de la page)
     * 2. Récupérer les infos des inputs du formulaire
     * 3. On veut ajouter cette nouvelle liste dans notre BDD
     * 4. on appelle la méthode de création (ajout dans le DOM) en lui passant le formData
     * 5. Fermer la modale
     * 6. On reset le contenu du formulaire
     */
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await fetch(`${app.base_url}/lists`, {
        method: 'POST',
        body: formData
      });
      const jsonData = await response.json();
      if(!response.ok) { throw new Error("Impossible de créer la liste !")}
      app.makeListInDOM(jsonData);

    } catch (error) {
      alert(error);
      console.log(error);
    }
    app.hideModals();
    event.target.reset();
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
      const response = await fetch(`${app.base_url}/cards`, {
        method: 'POST',
        body: formData
      });
      const jsonData = await response.json();
      if(!response.ok) { throw new Error("Impossible de créer la carte !")}
      app.makeCardInDOM(jsonData);
    } catch (error) {
      alert(error);
      console.log(error);
    }
    app.hideModals();
    event.target.reset();
  },

  /* Anciennce méthode, utilisée lors du jour-1, voir la méthode en dessous pour la méthode jour-2
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
  }, */

  makeListInDOM: function(list){
    // Récupérer le template
    const template = document.getElementById("list-template");
    // Cloner le template
    const newList = document.importNode(template.content, true);
    //console.log(newList);
    //Je veux ajouter un titre dans le h2 à ma liste
    newList.querySelector("h2").textContent = list.name; // list {id: 1, name: "premiere liste"}

    newList.querySelector('.panel').dataset.listId = list.id;
    // => Utiliser ce console log pour bien comprendre l'histoire du dataset
    //console.log(newList.querySelector('.panel').dataset);

    // On rajoute l'id dans le deuxième endroit : le input hidden
    newList.querySelector("form input[name='list-id']").value = list.id;
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

  /* Méthode jour-1
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
  }, */

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

  getListsFromAPI: async function() {
    /**Je veux récupérer les listes disponibles sur mon API
     * Pour ensuite les afficher dans le DOM
     * Plan d'action :
     * 1. Appeler notre API sur la route /lists pour "GET" les listes
     * 2. On traite la response avec la méthode .json() pour extraire les données dans le response.body
     * 3. Si le code HTTP n'est pas un code succès, il faudra retourner une erreur
     * 4. Si on a un code succès, on créé les listes dans le DOM
     */
    const response = await fetch(`${app.base_url}/lists`);
    const jsonData = await response.json();
    if(!response.ok) { throw new Error("Un problème est survenu sur la requête HTTP !")};
    console.table(jsonData);
    for (const list of jsonData){
      app.makeListInDOM(list)
      for(const card of list.cards){
        app.makeCardInDOM(card);
      }
    }
  }

};



// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );