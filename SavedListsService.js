class SavedListsService {
    load(userId) {
        return fetch('http://localhost:3003/list/load', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId
            })
        })
        .then(res => res.json())
    }
    save(userId, list) {
        fetch('http://localhost:3003/list/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                listObj: list
            })
        })
        .then(res => log(res.statusText))
        .catch(err => log(err))
    }
    getList(query) {
        return fetch('http://localhost:3003/list/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query
            })
        })
        .then(res => res.json())       
        
    }
}