const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash');

    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList);
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).json({ message: 'The user with the given ID was not found.' })
    }
    res.status(200).send(user);
})

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if (!user)
        return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.put('/:id', async (req, res) => {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if (req.body.password) {
        // var salt = bcrypt.genSaltSync(10);
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            role: req.body.role,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true }
    )

    if (!user)
        return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.post('/login', async (req, res,next) => {
    try{    
        const user = await User.findOne({ email: req.body.email })
        const secret = process.env.SECRET;
        // if (!user) {
        //     return res.status(400).send({status:false,message:"Invalid email or password!"});
        // }

    
        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                    role: user.role,
                    email: user.email
                },
                secret,
                { expiresIn: '1d' }
            )
                
            res.status(200).send({ email: user.email, token })
        } 
        else {
            // res.status(422).send({status:false, message:'Invalid email or password!'});            
            throw new Error('invalid username or password')
            
        }
    } catch(err){
        next(err)
    }
        
    


})


router.post('/register', async (req, res, next) => {
    
        const userExist = await User.findOne({ email: req.body.email }).countDocuments();
        if (userExist == 0) {
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                passwordHash: bcrypt.hashSync(req.body.password, 10),
                phone: req.body.phone,
                role: req.body.role,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country,
            })
            user = await user.save();
            return res.send(user)                    
        } else {
            return res.status(400).send({status:false,message:'user already exist'})            
            // throw new Error('user already exist')
        }
   

})


router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'the user is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "user not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments((count) => count)

    if (!userCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        userCount: userCount
    });
})


module.exports = router;