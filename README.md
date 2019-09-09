# Projet 8 #
## Reprenez et améliorez un projet existant

Projet 8 de la formation OpenClassrooms **Développeur d'applications Front-End**

Amélioration d'un projet existant, mise en place de tests unitaires, optimisation de performance, rédaction de la documentation utilisateur et technique

![todoList](http://remipiquet.org/todolist/img/todoList.png)

[Voir l'application en ligne](https://www.remipiquet.org/todolist/)

## Etape 1 : Corrigez les bugs

Le premier bug est une faute de frappe :
>Controller.prototype.adddItem 
>
remplacé par
>Controller.prototype.addItem
>
```javascript
Controller.prototype.addItem  =  function (title) { 
    var  self  =  this;
    if (title.trim() ===  '') {
	return;
    }
    self.model.create(title, function () {

    self.view.render('clearNewTodo');

    self._filter(true);
    });
};
```

Le second bug introduit un conflit éventuel entre deux IDs identiques.
Il est situé dans le fichier `store.js` au sein de la fonction suivante :
```javascript
Store.prototype.save
```
J'ai donc choisi après plusieurs tests d'appliquer la méthode suivante :
```javascript
// Assign an ID
updateData.id  =  Date.now(); // Return the number of milliseconds since 1970/01/01 at 00:00
todos.push(updateData);
localStorage[this._dbName] =  JSON.stringify(data);
callback.call(this, [updateData]);
```
La méthode `Date.now()` appliquée à cette fonction permet de donner un identifiant unique basé sur le nombre de millisecondes écoulées depuis le 1er janvier 1970 à 00:00. Cela permet donc à l'application d'éviter d'avoir d'éventuels IDs identiques.

La boucle if de la fonction `getFile` présente en ligne 137 du fichier `base.js` a été remplacée par l'instruction "try-catch" :
```javascript
function getFile(file, callback) {
    try {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', findRoot() + file, true);
	xhr.send();
	xhr.onload = function () {
	    if (xhr.status === 200 && callback) {
		callback(xhr.responseText);
	    }
	};
    }
    catch (error){
	console.error(error);
    }
}
```
Une erreur liée à la requette CORS apparaitra en local mais pas en ligne (https).

Dans le fichier `controller.js`, la boucle `forEach` est inutile. Le `console.log` a été déplacé dans la fonction `self.model.remove`:
```javascript
Controller.prototype.removeItem = function (id) {
    var self = this;
    var items;
    self.model.read(function(data) {
	items = data;
    });
    // FIXME: suppression de la boucle forEach inutile et décalage du console.log
    self.model.remove(id, function () {
	self.view.render('removeItem', id);
	console.log("Element with ID: " + id + " has been removed.");
    });
    self._filter();
};
```

## Etape 2 : Ou sont les tests ?!

Dans un premier temps, il convient d'installer NPM et Node.js afin de pouvoir déployer Jasmine.

Pour lancer les test unitaires, ouvrez dans votre navigateur le fichier suivant à la racine du projet : `./test/SpecRunner.html`

Le fichier code des tests Jasmine se trouve à l'emplacement suivant : **[ControllerSpec.js](https://github.com/remipiquet/todo-list-project/blob/master/test/ControllerSpec.js)**

J'ai donc repris la structure en place et appliqué les mêmes méthodes pour effectuer les tests qui n'étaient pas développés.

Le test suivant a été ajouté :
```javascript
it('should highlight "Completed" filter when switching to completed view', function () {
    // Teste si le bouton 'Completed' est activé lorsque l'on passe en vue 'conpleted'
    // TODO: added test
	var todo = {id: 42, title: "my todo", completed: true};
	setUpModel([todo]);
	subject.setView("#/completed");
	expect(view.render).toHaveBeenCalledWith("setFilter", "completed");
	});
```

## Etape 3 : Optimisez la performance

Voir le wiki **[Audit de performance](https://github.com/remipiquet/todo-list-project/wiki/Audit-todolistme.net)**


## Etape 4 : Améliorez le projet

Voir le wiki **[Documentation utilisateur](https://github.com/remipiquet/todo-list-project/wiki/Documentation-utilisateur)**

