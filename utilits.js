const log = console.log;

function mergeArrays(arrs) {
    return [...new Set(arrs.reduce((a, b) => [...a, ...b], []))];
}

function createPageItem(container, text, value, option) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.classList.add('page-link');
    li.classList.add('page-item');

    if(option === 'disabled') {
        li.classList.add('disabled');
    }
    if(option === 'active') {
        li.classList.add('active');
    }
    a.innerText = text;
    a.dataset.page = value;

    li.appendChild(a);
    container.appendChild(li);
}

const sortByName = (a, b) => a.name > b.name ? 1 : -1;
const sortByCheck = (a, b) => a.selected === b.selected ? 0 : b.selected ? 1 : -1;

function createRandomLists(num) {
  for(let i = 0; i <  num; i++) {
      const number = Math.ceil(Math.random() * 1000);
      controller.onSaveListHandler(`RandomList#${number}`)
  }
}