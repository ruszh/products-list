class SavedListsService {
    load(userId, page) {
        return fetch(`${CONFIG.url}list/load`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                limit: CONFIG.limit,
                page
            })
        })
        .then(res => res.json());
    }
    save(listObj) {
        return fetch(`${CONFIG.url}list/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(listObj)
        })
        .then(res => res.json())        
    }
    getList(listId) {
        return fetch(`${CONFIG.url}list/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                listId
            })
        })
        .then(res => res.json())       
        
    }
}