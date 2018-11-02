class AuthService {
    verification() {
        const token = localStorage.getItem('token');
        return fetch(`${CONFIG.url}user/verify`, {
                    method: 'GET',
                    headers: {
                        'x-access-token': token
                    }
                })
                .then(res => res.json())
    }
    signin(user) {
        let email = user.email.toLowerCase();
        let password = user.password.toLowerCase();
        
        return fetch(`${CONFIG.url}user/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json());
        
    }
}