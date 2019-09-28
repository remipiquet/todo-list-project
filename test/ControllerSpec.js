/*global app, jasmine, describe, it, beforeEach, expect */

describe('controller', function () {
	'use strict';

	var subject, model, view;

	var setUpModel = function (todos) {
		model.read.and.callFake(function (query, callback) {
			callback = callback || query;
			callback(todos);
		});

		model.getCount.and.callFake(function (callback) {

			var todoCounts = {
				active: todos.filter(function (todo) {
					return !todo.completed;
				}).length,
				completed: todos.filter(function (todo) {
					return !!todo.completed;
				}).length,
				total: todos.length
			};

			callback(todoCounts);
		});

		model.remove.and.callFake(function (id, callback) {
			callback();
		});

		model.create.and.callFake(function (title, callback) {
			callback();
		});

		model.update.and.callFake(function (id, updateData, callback) {
			callback();
		});
	};

	var createViewStub = function () {
		var eventRegistry = {};
		return {
			render: jasmine.createSpy('render'),
			bind: function (event, handler) {
				eventRegistry[event] = handler;
			},
			trigger: function (event, parameter) {
				eventRegistry[event](parameter);
			}
		};
	};

	beforeEach(function () {
		model = jasmine.createSpyObj('model', ['read', 'getCount', 'remove', 'create', 'update']);
		view = createViewStub();
		subject = new app.Controller(model, view);
	});

	//TODO: test si on crée une tache, qu'on la supprime, et qu'on en récrée une nomée pareille, elle doit avoir un ID différent de la première

	it('should show entries on start-up', function () {
		// TODO: write test
		// Teste le modèle et la vue au 1er lancement (liste de Todos vide)
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('showEntries', []);
	});

	describe('routing', function () {

		it('should show all entries without a route', function () {
			// Teste le modèle et la vue au lancement avec un élément dans la liste de Todos
			var todo = {title: 'my todo'};
			setUpModel([todo]);

			subject.setView('');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});

		it('should show all entries without "all" route', function () {
			// Teste le modèle et la vue avec tous les éléments ('all' || 'active' ||'completed')
			var todo = {title: 'my todo'};
			setUpModel([todo]);

			subject.setView('#/');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});

		it('should show active entries', function () {
			// TODO: write test
			// Teste le modèle et la vue avec les éléments 'active'
			var todo = {title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('#/active');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});

		it('should show completed entries', function () { //FIXME: celui là était mal réglé ? Il était sur 'completed : false'
			// TODO: write test
			// Teste le modèle et la vue avec les éléments 'completed'
			var todo = {title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('#/completed');

			expect(model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
		});
	});

	it('should show the content block when todos exists', function () {
		// Teste si le bloc de contenu s'affiche quand il y a des Todos
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: true
		});
	});

	it('should hide the content block when no todos exists', function () {
		// Teste si le bloc de contenu se masque quand il n'y a pas de Todos
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: false
		});
	});

	it('should check the toggle all button, if all todos are completed', function () {
		// Teste le bouton 'toggle' lorsque les Todos sont cochées
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('toggleAll', {
			checked: true
		});
	});

	it('should set the "clear completed" button', function () {
		// Teste si le bouton 'clear completed' s'affiche lorsque les Todos sont cochées
		var todo = {id: 42, title: 'my todo', completed: true};
		setUpModel([todo]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
			completed: 1,
			visible: true
		});
	});

	it('should highlight "All" filter by default', function () {
		// Teste si le bouton 'All' est activé par défaut
		// TODO: write test
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('setFilter', '');
	});

	it('should highlight "Active" filter when switching to active view', function () {
		// Teste si le bouton 'Active' est activé lorsque l'on passe en vue 'active'
		// TODO: write test
		setUpModel([]);

		subject.setView('#/active');

		expect(view.render).toHaveBeenCalledWith('setFilter', 'active');
	});

	describe('toggle all', function () {
		it('should toggle all todos to completed', function () {
			// Teste le bouton pour cocher toutes les taches
			// TODO: write test
			var todos = [{id: 21, title: 'my todo', completed: false},
						{id: 42, title: 'another todo', completed: false}
						]
			setUpModel(todos);

			subject.setView('');

			view.trigger('toggleAll', {completed: true});

			expect(model.update).toHaveBeenCalledWith(21, {completed: true}, jasmine.any(Function));
			expect(model.update).toHaveBeenCalledWith(42, {completed: true}, jasmine.any(Function));
		});

		it('should update the view', function () {
			// Teste si la vue se met à jour lorsqu'on clique sur l'élément 'toggle all'
			// TODO: write test
			var todos = [{id: 21, title: 'todo', completed: false},
						{id: 42, title: 'another todo', completed: false}
						]
			setUpModel([todos]);

			subject.setView('');

			view.trigger('toggleAll', {completed: false});

			expect(view.render).toHaveBeenCalledWith('updateElementCount', 1);
		});
	});

	describe('new todo', function () {
		it('should add a new todo to the model', function () {
			// Teste l'ajout d'une tache dans le modèle
			// TODO: write test
			setUpModel([]);

			subject.setView('');

			view.trigger('newTodo', 'a new todo');

			expect(model.create).toHaveBeenCalledWith('a new todo', jasmine.any(Function));
		});

		it('should add a new todo to the view', function () {
			// Teste l'ajout d'une tache dans la vue
			setUpModel([]);

			subject.setView('');

			view.render.calls.reset();
			model.read.calls.reset();
			model.read.and.callFake(function (callback) {
				callback([{
					title: 'a new todo',
					completed: false
				}]);
			});

			view.trigger('newTodo', 'a new todo');

			expect(model.read).toHaveBeenCalled();

			expect(view.render).toHaveBeenCalledWith('showEntries', [{
				title: 'a new todo',
				completed: false
			}]);
		});

		it('should clear the input field when a new todo is added', function () {
			// Teste si le champ de saisie se vide lors de la validation d'une nouvelle tache
			setUpModel([]);

			subject.setView('');

			view.trigger('newTodo', 'a new todo');

			expect(view.render).toHaveBeenCalledWith('clearNewTodo');
		});
	});

	describe('element removal', function () {
		it('should remove an entry from the model', function () {
			// Teste la suppression d'une entrée dans le modèle
			// TODO: write test
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemRemove', {id: 42});

			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove an entry from the view', function () {
			// Teste la suppression d'une entrée dans la vue
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});

		it('should update the element count', function () {
			// Teste le compteur de taches lorsqu'on supprime un élément
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
		});
	});

	describe('remove completed', function () {
		it('should remove a completed entry from the model', function () {
			// Teste la suppression d'une entrée 'completed' dans le modèle
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove a completed entry from the view', function () {
			// Teste la suppression d'une entrée 'completed' dans la vue
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});
	});

	describe('element complete toggle', function () {
		it('should update the model', function () {
			// Teste la mise à jour du statut 'completed' d'un élément dans le modèle
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 21, completed: true});

			expect(model.update).toHaveBeenCalledWith(21, {completed: true}, jasmine.any(Function));
		});

		it('should update the view', function () {
			// Teste la mise à jour du statut 'completed' d'un élément dans la vue
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 42, completed: false});

			expect(view.render).toHaveBeenCalledWith('elementComplete', {id: 42, completed: false});
		});
	});

	describe('edit item', function () {
		it('should switch to edit mode', function () {
			// Teste l'entrée en mode édition lorsqu'on double clique sur un élément
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEdit', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItem', {id: 21, title: 'my todo'});
		});

		it('should leave edit mode on done', function () {
			// Teste la sortie du mode édition
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'new title'});
		});

		it('should persist the changes on done', function () {
			// Teste la persistance des données du modèle
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(model.update).toHaveBeenCalledWith(21, {title: 'new title'}, jasmine.any(Function));
		});

		it('should remove the element from the model when persisting an empty title', function () {
			// Teste la suppression d'un élément du molèle lorsque le titre est vide
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
		});

		it('should remove the element from the view when persisting an empty title', function () {
			// Teste la suppression d'un élément de la vue lorsque le titre est vide
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(view.render).toHaveBeenCalledWith('removeItem', 21);
		});

		it('should leave edit mode on cancel', function () {
			// Teste l'annulation du mode édition en cas d'annulation 
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'my todo'});
		});

		it('should not persist the changes on cancel', function () {
			// Teste la non persistance des données du modèle lors d'une annulation
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(model.update).not.toHaveBeenCalled();
		});
	});
});
