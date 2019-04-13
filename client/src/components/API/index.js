import axios from 'axios';

const API = {
    getScores: function () {
        return axios.get('/api/high_scores');
    },
    saveScore: function (score) {
        return axios.post('/api/high_scores', score);
    },
    highestScore: function (id) {
        console.log(id);
        return axios.get('/api/high_scores/' + id);
    }
}

export default API;