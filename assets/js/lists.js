const listModule = {

    showAddListModal: function(){
        const modal = document.getElementById("addListModal");
        modal.classList.add('is-active');
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
          const response = await fetch(`${utilModule.base_url}/lists`, {
            method: 'POST',
            body: formData
          });
          const jsonData = await response.json();
          if(!response.ok) { throw new Error("Impossible de créer la liste !")}
          listModule.makeListInDOM(jsonData);
    
        } catch (error) {
          alert(error);
          console.log(error);
        }
        utilModule.hideModals();
        event.target.reset();
      },
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
        newList.querySelector(".button--add-card").addEventListener('click', cardModule.showAddCardModal)
    
    
        //Insérer la nouvelle liste en premiere position
        const listContainer = document.querySelector("#listContainer");
        const firstList = listContainer.querySelector(".panel"); //Désigne la premiere liste dans listContainer
        if(firstList){
          firstList.before(newList);
        } else {
          listContainer.appendChild(newList);
        }
      },
}