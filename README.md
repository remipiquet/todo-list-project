# Projet 8 #
## Reprenez et améliorez un projet existant

Projet 8 de la formation OpenClassrooms **Développeur d'applications Front-End**

Amélioration d'un projet existant, mise en place de tests unitaires, optimisation de performance, rédaction de la documentation utilisateur et technique

![todoList](http://remipiquet.org/todolist/img/todoListMain.jpg)

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

