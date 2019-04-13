let Scores = require('../models/Scores');
module.exports = function(router) {
    router.get('/api/high_scores', function(req, res) {
        Scores.find({},null, {sort:{
            high_score: -1 
        }}, (err, scores) => {
            if (err) throw err;
            res.json(scores);
        })
    });
    router.post('/api/high_scores', (req, res) => {
        let score = req.body;
        Scores.findOne({ email: score.email }, (err, result) => {
            if (err) throw err;
            if (result) {
                if (result.high_score < score.high_score) {
                    Scores.update({ userId: score.userId }, { high_score: score.high_score }, (err, data) => {
                        if (err) throw err;
                        res.json(data);
                    })
                } else {
                    res.json(null);
                }
            } else {
                let score1 = new Scores(score);
                score1.save((err, score)=>{
                    if (err) throw err;
                    res.json(score);
                })
            }
        })
    });
    router.get('/api/high_scores/:id', (req, res) => {
        Scores.findOne({ email: req.params.id }, (err, result) => {
            if (err) return err;
            res.json(result);
        })
    } )
}