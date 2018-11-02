class InitService {
    fetchData() {
        return fetch('http://localhost:3003/user/getlists')
                .then(res => res.json())                
    }
}