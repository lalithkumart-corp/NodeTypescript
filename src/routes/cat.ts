import express from 'express';
let router = express.Router();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Cat router IN : ', Date.now())
    next();
});

router.get('/', (req, res) => {
    res.send('Welcome to Cat home page.');
});

router.route('/name')
    .get((req, res)=>{
        res.send('Cat name is Leo.');
    })
    .post((req, res) => {
        res.send('CAT NAME HAS BEEN UPDATED SUCCESSFULLY!');
    })

router.get('/about', (req, res) => {
    let about = 'The cat is a domestic species of small carnivorous mammal. It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it from the wild members of the family.';
    res.send(about);
});

export default router;