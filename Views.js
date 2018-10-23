class SearchView {
    constructor(targetId) {
        this.inputContainer = document.getElementById(targetId);
        this.searchResultContainer = document.createElement('div');
        this.inputElement = document.createElement('input');

        this.initListeners();
    }

    initListeners() {
        this.inputElement.addEventListener('keydown', _.debounce(
            (e) => this.onSearch ? this.onSearch(e) : () => {}, 1000, { leading: false, trailing: true }
        ));

        this.searchResultContainer.addEventListener('click', 
            (e) => this.selectedItem ? this.selectedItem(e) : () => {}
        );        
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

        this.selectedItems = [];
        
    }

    render(arr) {      
        if(this.selectedItems.length) {
            arr.sort((a, b) => a.selected === b.selected ? 0 : b.selected ? 1 : -1 );
        } else {
            arr.sort((a, b) => a.name > b.name ? 1 : -1 );
        }

        this.listContainer.innerHTML = '';

        const ul = document.createElement('ul');
        
        const btn = document.createElement('button');

        btn.className = 'btn btn-light';
        btn.innerText = 'check/uncheck all';
        btn.onclick = this.toggleAll.bind(this);  

        this.listContainer.appendChild(btn);

        ul.className = 'list-group';
        
        arr.forEach(el => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');

            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';
            li.className = 'list-group-item';

            if(el.active === false) li.classList.add("not-selected");

            if(this.selectedItems.indexOf(el.id) !== -1) checkbox.checked = true;

            li.dataset.id = el.id;

            checkbox.addEventListener('change', (e) => this.onSelected(e));

            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(el.name));

            ul.appendChild(li);
        });

        this.listContainer.appendChild(ul);
    }

    toggleAll() {
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

    selectedItems() {
        const checkboxes = this.listContainer.querySelectorAll('.checkbox');
        
        checkboxes.forEach((el) => {
            if(el.checked) {
                this.selectedItems.push(+el.parentNode.dataset.id)
            }
        });
        return selectedItemsArr;
    }
}

