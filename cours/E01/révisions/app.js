console.log("hello world !");

//const appElement = document.getElementById("app");
// const appElement = document.querySelector("#app");

//console.log(appElement);


const app = {
    init() {
        console.log("Application initialisée !");
        app.createSubtitle();
        //app.getCitiesFromDepartment();
        app.addFormSubmitListener();
    },

    createSubtitle() {
        /** Je veux créer un sous titre en JS, et l'insérer dans la page
         * Plan d'action
         * 1. Créer l'élement HTML h2
         * 2. Ecrire le contenu du sous titre
         * 3. Selectionner le parent (on récupère la div qui possède l'id app)
         * 4. On ajoute l'élément créé (h2) dans la div "app" dans le DOM
         */
        const subtitleElement = document.createElement("h2");
        subtitleElement.textContent = "Bienvenue sur ma première single page application !";
        const appElement = document.getElementById("app");
        appElement.appendChild(subtitleElement);
    },

    async getCitiesFromDepartment(code) {
        const url = `https://geo.api.gouv.fr/departements/${code}/communes` ;

        // En mode promise.then
        /* fetch(url)
            .then((response) => { 
                if(!response.ok){ throw new Error('Erreur dans la requête !')}
                return response.json();
            })
            .then((jsonData) => console.log(jsonData))
            .catch((error) => console.log(error)) */

        // En mode async/await !
        try {
            const response = await fetch(url);
            if(!response.ok){ throw new Error('Erreur dans la requête !') }
            const jsonData = await response.json();
            console.log(jsonData);
        } catch (error) {
            console.log(error);
        }
    },

    addFormSubmitListener() {
        const formElement = document.querySelector('form');
        formElement.addEventListener("submit", app.handleFormSubmit)
    },

    handleFormSubmit(event) {
        // Le comportement par défaut du submit sur un form, c'est de refresh la page
        //On peut bloquer ce comportement comme suit :
        event.preventDefault();
        console.log("Envoyé !");
        const formData = event.target;
        const formDataObject = new FormData(formData);
        console.log(formDataObject.get("departmentCode"));
        console.log(formDataObject.get("platPrefere"));
        console.log(formDataObject.get("chatPrefere"));
        //On a bien récupéré les données contenues dans nos 3 champs form
        // SAuf que c'est pas pratique... Imaginez qu'on aurait besoin de 50 champs...
        // On utilise la classe Object, qui possede une méthode de classe .fromEntries
        // Cette méthode va récupérer toutes les données dans un objet (ici formDataObject)
        // puis les combiner dans un objet facilement interprétable
        const data = Object.fromEntries(formDataObject);
        console.log(data);
        // Ultra pratique pour envoyer plusieurs champs vers une API lorsqu'on fera une requete de type post
        const code = formDataObject.get("departmentCode");
        // const code = data.departmentCode;

        app.getCitiesFromDepartment(code);
    }
}

document.addEventListener('DOMContentLoaded', app.init);