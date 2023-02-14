const tagModule = {

    makeTagInDOM: function(tag){
        const tagDOM = document.createElement('span');

        // On veut lui donner un tagId (qui sera l'id du tag dans la db)
        tagDOM.dataset.tagId = tag.id;
        // On veut lui insérer du contenu (son nom)
        tagDOM.textContent = tag.name;
        // On veut lui donner une couleur
        tagDOM.style.backgroundColor = tag.color;
        // On veut lui donner la classe "tag" de Bulma
        tagDOM.classList.add("tag");

        // On veut récupérer la carte où ce tag sera inséré
        const cardDOM = document.querySelector(`.box[data-card-id="${tag.card_has_tag.card_id}"]`);
        // On veut insérer ce tag dans sa carte
        cardDOM.querySelector(".tags").appendChild(tagDOM);
    }
}