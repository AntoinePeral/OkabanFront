# oKanban-front, jour 5

## Bundle
Pour pouvoir créer un bundle il nous faut 2 choses : 
- installer un "bundlizer" (on va utiliser browserify)
- utiliser `module.exports` et `require` pour "faire le lien" entre les modules !

On déplace aussi nos fichiers dans un nouveau dossier "src" (par convention).

## Installer et utiliser Browserify
- `npm init -y`
- `npm install browserify`
- `browserify -e src/app.js -o assets/js/bundle.js`

On donne à browserify un point d'entrée (-e) et un fichier de sortie (-o). Ensuite il "suit" les `require` pour savoir quel fichier embarquer !

On peut aussi minifier notre bundle ! Il faut pour cela ajouter le plugin `tinyify` lors de l'exécution de la commande.

Il faut avant toute chose installer le plugin avec npm : `npm i tinyify` 

Puis exécuter la commande : `browserify -e src/app.js -o assets/js/bundle.min.js -p tinyify`

Enfin, l'idéal est d'en faire un script npm dans le package.json pour le lancer facilement avec `npm run build` !

```json
"scripts": {
    "build": "browserify -e src/app.js -o assets/js/bundle.min.js -p tinyify"
}
````
---