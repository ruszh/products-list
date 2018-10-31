class SearchView {
    constructor(targetId) {
        this.inputContainer = document.getElementById(targetId);
        this.searchResultContainer = document.createElement('div');
        this.inputElement = document.createElement('input');

        this.initListeners(targetId);
    }

    initListeners(targetId) {
        this.inputElement.addEventListener('keydown', _.debounce(            
            (e) => this._onSearch(e, `search-${targetId}`),
            1000, { leading: false, trailing: true }
        ));

        this.searchResultContainer.addEventListener('click',
            (e) => this._onSelect(e, `select-${targetId}`)
        );        
    }

    _onSearch(e, eventName) {
        const value = e.target.value.toLowerCase();
        return ee.emit(eventName, value);
    }

    _onSelect(e, eventName) {
        const id = Number(e.target.dataset.id);
        return ee.emit(eventName, id);
    }

    render() {
        this.inputElement.type = "text";
        this.inputElement.className = "form-control search-input";
        this.inputElement.placeholder = "Search";
        
        this.inputContainer.appendChild(this.inputElement);
    }

    renderSearchList(arr) {
        if(!arr.length) return;
        this.searchResultContainer.innerHTML = '';
        this.searchResultContainer.className = 'dropdown-menu search-dropdown';

        arr.forEach(el => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.innerText = el.name;
            item.dataset.id = el.id;

            this.searchResultContainer.appendChild(item);
        });
        
        this.searchResultContainer.style.display = 'block';
        this.inputContainer.appendChild(this.searchResultContainer);
        
    }
    
    hideSearchList() {
        this.searchResultContainer.innerHTML = '';
        this.inputElement.value = '';
        this.searchResultContainer.style.display = 'none';
    }
    
}

class ListView {
    constructor(targetId) {
        this.listContainer = document.getElementById(targetId);
        this.eventName = `select-${targetId}`;

        this.selectedItems = [];
        
    }

    render(arr) {      
        if(this.selectedItems.length) {
            arr.sort(sortByCheck);
            
        } else {
            arr.sort(sortByName);
        }
        
        this.listContainer.innerHTML = '';

        const ul = document.createElement('ul');
        
        const btn = document.createElement('button');

        btn.className = 'btn btn-light';
        btn.innerText = 'check/uncheck all';
        btn.onclick = this._toggleAll.bind(this);  

        this.listContainer.appendChild(btn);

        ul.className = 'list-group';
        
        arr.forEach(el => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');

            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';
            li.className = 'list-group-item';

            if(el.active === false) li.classList.add("not-active");

            if(this.selectedItems.indexOf(el.id) !== -1) checkbox.checked = true;

            li.dataset.id = el.id;
 
            checkbox.addEventListener('change', (e) => this._onSelect(e));

            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(el.name));

            ul.appendChild(li);
        });

        this.listContainer.appendChild(ul);
    }

    _toggleAll() {
        const checkboxes = this.listContainer.querySelectorAll('.checkbox');
        let notSelected = 0; 

        const change = new Event('change')  
        checkboxes.forEach(el => {
            if(!el.checked) notSelected++;
        });
        checkboxes.forEach(el => {
            if(notSelected > 0) {
                if(el.checked) return;              
                el.dispatchEvent(change);
            } else {
                el.dispatchEvent(change);
            }
        });
    }

    _onSelect(e) {
        const id = Number(e.target.parentNode.dataset.id);
        return ee.emit(this.eventName, id);
    }

    select(id) {
        
        const selected = this.selectedItems;   

        if(!id) return selected;
        if(selected.indexOf(id) !== -1) {
            selected.splice(selected.indexOf(id), 1);  
            return;
        }
        selected.push(id);

        return selected;
    }

    

    getSelectedItems() {
        const checkboxes = this.listContainer.querySelectorAll('.checkbox');
        
        checkboxes.forEach((el) => {
            if(el.checked) {
                this.selectedItems.push(+el.parentNode.dataset.id)
            }
        });
        
        return selectedItemsArr;
    }
}

class AuthenticationView {
    constructor(targetId) {
        this.container = document.getElementById(targetId);
        this.form = this.container.querySelector('form');
        this.spinner = document.querySelector('#spinner');
        this.authUser;        

        this.form.addEventListener('submit', (e) => this._submitHandler(e));
    }

    showSpinner() {
        this.spinner.style.display = 'block'
        log('show spinner')
    }

    hideSpinner() {
        this.spinner.style.display = 'none'
        log('hide spinner')
    }

    renderLoginUserData() {
        let wrapperEl = document.body.querySelector('#login-wrapper');
        if(wrapperEl) wrapperEl.remove();

        const wrapper = document.createElement('div');
        const userData = document.createElement('span');
        const logoutBtn = document.createElement('button');

        wrapper.className = 'container login-wrapper';
        wrapper.id = 'login-wrapper'
        userData.innerText = `User: ${this.authUser.email}`;
        userData.className = 'float-right user-data'

        logoutBtn.className = 'btn float-right btn-outline-primary';
        logoutBtn.innerText = 'logout';
        logoutBtn.addEventListener('click', () => this._logoutHandler());
        
        wrapper.appendChild(logoutBtn);
        wrapper.appendChild(userData);

        document.body.appendChild(wrapper);
        
    }


    hideRegisterForm() {              
        this.container.style.display = 'none';
        this.renderLoginUserData()
    }

    showRegisterForm() {        
        this.container.style.display = 'block';        
        document.getElementById('login-wrapper').remove();
    }

    _submitHandler(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.elements[0].value;
        const password = form.elements[1].value
        
        if(!email && !password) return;

        const data = {
            email: email,
            password: password
        }

        return ee.emit('submit', data)
    }

    _logoutHandler() {
        return ee.emit('logout');
    }

    invalidForm() {
        this.form.elements[0].classList.add('is-invalid');
        this.form.elements[1].classList.add('is-invalid');     
    }

    validForm() {
        this.form.elements[0].classList.remove('is-invalid');
        this.form.elements[1].classList.remove('is-invalid');
    }
    
}

class SavedListView {
    constructor(targetId) {
        this.wrapper = document.getElementById(targetId);
        this.saveInput = document.getElementById('save-input');
        this.saveButton = document.getElementById('save-button');
        this.loadListsContainer = document.getElementById('load-lists-container');

        this.savedLists;

        this.saveButton.addEventListener('click', () => {
            this.onSaveHandler();

        });

        this.loadListsContainer.addEventListener('click', (e) => {
            this.selectedList(e);
        })
    }

    render() {
        this.wrapper.innerHTML = '';
        const saveBtn = document.createElement('button');
        const loadBtn = document.createElement('button');

        saveBtn.innerText = 'Save';
        loadBtn.innerText = 'Load';

        saveBtn.classList.add('btn', 'save-btn', 'btn-success');
        loadBtn.classList.add('btn', 'load-btn', 'btn-primary');

        saveBtn.dataset.toggle = 'modal';
        saveBtn.dataset.target = '#saveModal';

        loadBtn.dataset.toggle = 'modal';
        loadBtn.dataset.target = '#loadModal';

        loadBtn.addEventListener('click', () => {
            ee.emit('load-list');
        });

        this.wrapper.appendChild(saveBtn);
        this.wrapper.appendChild(loadBtn);

    }

    renderLoadedLists(listsArr) {
        if(!listsArr.length) return;
        this.loadListsContainer.innerHTML = '';
        const ul = document.createElement('ul');
        ul.classList.add('list-group');

        listsArr.forEach(el => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');

            li.innerText = el.listName;
            ul.appendChild(li);
        })

        this.loadListsContainer.appendChild(ul);
    }

    onSaveHandler() {
        const listName = this.saveInput.value;
        if(!listName.length) return;
        ee.emit('save-list', listName);
        this.saveInput.value = '';
        $('#saveModal').modal('hide');
    }

    hideButtons() {
        this.wrapper.innerHTML = '';
    }

    selectedList(e) {      
        if(e.target.tagName !== 'LI') return;
        const listName = e.target.innerText;
        
        ee.emit('select-list', this.savedLists.find(el => el.listName == listName)._id);
        $('#loadModal').modal('hide');
    }

}