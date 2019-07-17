import axios from 'axios';

class Utils {

    static get backend() {
        return 'http://localhost:5000/api/v1';
    }

    static get UserType() {
        return {
            UNLOGGED: 0,
            ADMIN: 1,
            USER: 2
        };
    }

    static get AuthToken() {
        return localStorage.getItem('token');
    }

    static isLogged() {
        let token = localStorage.getItem('token');
        if (typeof token !== 'undefined') {
            return axios.get(`${this.backend}/authentication/isLogged`, {
                headers: {
                    Authorization: token
                }
            }).then((response) => {
                return response.data;
            }).catch(() => {
                return false;
            });
        } else {
            return false;
        }
    }
}

export default Utils;